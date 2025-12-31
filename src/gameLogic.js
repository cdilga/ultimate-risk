/**
 * Game Logic for Ultimate Risk
 * Handles game state, turns, combat, and rules
 */

import { NATIONS, TERRITORIES, TERRITORY_CONNECTIONS, GAME_PHASES } from './gameData.js';

export class GameState {
  constructor(playerNations = ['germany', 'britain', 'usa', 'russia']) {
    this.gameId = this.generateGameId();
    this.turn = 1;
    this.currentPlayer = 0;
    this.phase = GAME_PHASES.PURCHASE;
    this.players = playerNations.map((nationId, index) => ({
      id: index,
      nationId: nationId,
      currency: NATIONS[nationId.toUpperCase()].startingCurrency,
      units: [],
      territories: this.getStartingTerritories(nationId)
    }));
    this.territories = this.initializeTerritories();
    this.combatLog = [];
  }

  generateGameId() {
    return 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getStartingTerritories(nationId) {
    const territories = [];
    for (const [id, territory] of Object.entries(TERRITORIES)) {
      if (territory.owner === nationId) {
        territories.push(id);
      }
    }
    return territories;
  }

  initializeTerritories() {
    const territories = {};
    for (const [id, territory] of Object.entries(TERRITORIES)) {
      territories[id] = {
        ...territory,
        units: []
      };
    }
    return territories;
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayer];
  }

  getPlayerByNation(nationId) {
    return this.players.find(p => p.nationId === nationId);
  }

  // Purchase units
  purchaseUnit(playerId, unitType, quantity = 1) {
    const player = this.players[playerId];
    if (!player) return { success: false, error: 'Player not found' };

    if (this.phase !== GAME_PHASES.PURCHASE) {
      return { success: false, error: 'Not in purchase phase' };
    }

    const nation = NATIONS[player.nationId.toUpperCase()];
    const unit = nation.units[unitType];

    if (!unit) return { success: false, error: 'Invalid unit type' };

    const totalCost = unit.cost * quantity;
    if (player.currency < totalCost) {
      return { success: false, error: 'Insufficient funds' };
    }

    player.currency -= totalCost;

    // Add units to player's pending deployment
    for (let i = 0; i < quantity; i++) {
      player.units.push({
        id: this.generateUnitId(),
        type: unitType,
        unitData: unit,
        deployed: false,
        territoryId: null
      });
    }

    return {
      success: true,
      message: `Purchased ${quantity} ${unit.name}`,
      remainingCurrency: player.currency
    };
  }

  generateUnitId() {
    return 'unit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Deploy purchased units to territories
  deployUnit(playerId, unitId, territoryId) {
    const player = this.players[playerId];
    if (!player) return { success: false, error: 'Player not found' };

    const unit = player.units.find(u => u.id === unitId);
    if (!unit) return { success: false, error: 'Unit not found' };
    if (unit.deployed) return { success: false, error: 'Unit already deployed' };

    // Check if player owns the territory
    if (!player.territories.includes(territoryId)) {
      return { success: false, error: 'You do not control this territory' };
    }

    unit.deployed = true;
    unit.territoryId = territoryId;
    this.territories[territoryId].units.push({
      playerId: playerId,
      unitId: unitId,
      type: unit.type,
      unitData: unit.unitData
    });

    return { success: true, message: 'Unit deployed successfully' };
  }

  // Move units between territories
  moveUnit(playerId, unitId, fromTerritory, toTerritory) {
    const player = this.players[playerId];
    if (!player) return { success: false, error: 'Player not found' };

    if (this.phase !== GAME_PHASES.MOVEMENT) {
      return { success: false, error: 'Not in movement phase' };
    }

    // Check if territories are connected
    const connections = TERRITORY_CONNECTIONS[fromTerritory];
    if (!connections || !connections.includes(toTerritory)) {
      return { success: false, error: 'Territories are not connected' };
    }

    const unit = player.units.find(u => u.id === unitId);
    if (!unit) return { success: false, error: 'Unit not found' };

    // Remove unit from old territory
    const fromTerr = this.territories[fromTerritory];
    const unitIndex = fromTerr.units.findIndex(u => u.unitId === unitId);
    if (unitIndex === -1) {
      return { success: false, error: 'Unit not in source territory' };
    }

    const movingUnit = fromTerr.units[unitIndex];
    fromTerr.units.splice(unitIndex, 1);

    // Add unit to new territory
    this.territories[toTerritory].units.push(movingUnit);
    unit.territoryId = toTerritory;

    // Check if territory is contested (enemy units present)
    const toTerr = this.territories[toTerritory];
    const enemyUnits = toTerr.units.filter(u => u.playerId !== playerId);

    if (enemyUnits.length > 0) {
      return {
        success: true,
        message: 'Unit moved - combat will occur!',
        combat: true
      };
    }

    // If no enemy units, capture the territory
    const currentOwner = this.getPlayerByNation(toTerr.owner);
    if (currentOwner && currentOwner.id !== playerId) {
      currentOwner.territories = currentOwner.territories.filter(t => t !== toTerritory);
      player.territories.push(toTerritory);
      toTerr.owner = player.nationId;
    }

    return { success: true, message: 'Unit moved successfully' };
  }

  // Simplified combat system
  resolveCombat(territoryId) {
    const territory = this.territories[territoryId];
    const units = territory.units;

    if (units.length === 0) return { success: false, error: 'No units in territory' };

    // Group units by player
    const playerUnits = {};
    units.forEach(unit => {
      if (!playerUnits[unit.playerId]) {
        playerUnits[unit.playerId] = [];
      }
      playerUnits[unit.playerId].push(unit);
    });

    const playerIds = Object.keys(playerUnits);
    if (playerIds.length < 2) {
      return { success: false, error: 'No combat - only one player present' };
    }

    // Simple combat: calculate total attack vs defense
    const combatResults = [];

    playerIds.forEach(attackerId => {
      const attacker = parseInt(attackerId);
      const defenders = playerIds.filter(id => parseInt(id) !== attacker);

      defenders.forEach(defenderId => {
        const defender = parseInt(defenderId);
        const attackPower = this.calculateCombatPower(playerUnits[attacker], 'attack');
        const defensePower = this.calculateCombatPower(playerUnits[defender], 'defense');

        // Roll dice
        const attackRoll = Math.floor(Math.random() * 6) + 1;
        const defenseRoll = Math.floor(Math.random() * 6) + 1;

        const attackTotal = attackPower + attackRoll;
        const defenseTotal = defensePower + defenseRoll;

        if (attackTotal > defenseTotal) {
          // Attacker wins - remove one defender unit
          const removedUnit = playerUnits[defender].pop();
          if (removedUnit) {
            combatResults.push({
              attacker,
              defender,
              result: 'attacker_wins',
              unitLost: removedUnit
            });
          }
        } else {
          // Defender wins - remove one attacker unit
          const removedUnit = playerUnits[attacker].pop();
          if (removedUnit) {
            combatResults.push({
              attacker,
              defender,
              result: 'defender_wins',
              unitLost: removedUnit
            });
          }
        }
      });
    });

    // Update territory units
    territory.units = [];
    Object.entries(playerUnits).forEach(([playerId, units]) => {
      units.forEach(unit => territory.units.push(unit));
    });

    // Determine territory owner
    if (territory.units.length > 0) {
      const winnerId = territory.units[0].playerId;
      const winner = this.players[winnerId];
      territory.owner = winner.nationId;

      // Update player territories
      this.players.forEach(player => {
        player.territories = player.territories.filter(t => t !== territoryId);
      });
      winner.territories.push(territoryId);
    }

    this.combatLog.push({
      turn: this.turn,
      territory: territoryId,
      results: combatResults
    });

    return { success: true, results: combatResults };
  }

  calculateCombatPower(units, type) {
    return units.reduce((total, unit) => {
      return total + (unit.unitData[type] || 0);
    }, 0);
  }

  // Collect income based on controlled territories
  collectIncome(playerId) {
    const player = this.players[playerId];
    if (!player) return { success: false, error: 'Player not found' };

    let income = 0;
    player.territories.forEach(territoryId => {
      const territory = TERRITORIES[territoryId.toUpperCase()];
      if (territory) {
        income += territory.value;
      }
    });

    player.currency += income;

    return {
      success: true,
      income,
      totalCurrency: player.currency
    };
  }

  // Advance to next phase or next player's turn
  nextPhase() {
    const phases = Object.values(GAME_PHASES);
    const currentIndex = phases.indexOf(this.phase);

    if (currentIndex < phases.length - 1) {
      this.phase = phases[currentIndex + 1];

      // Auto-collect income when entering that phase
      if (this.phase === GAME_PHASES.COLLECT_INCOME) {
        const player = this.getCurrentPlayer();
        this.collectIncome(player.id);
      }

      return { success: true, phase: this.phase, playerChange: false };
    } else {
      // Move to next player
      this.currentPlayer = (this.currentPlayer + 1) % this.players.length;

      // If back to first player, increment turn
      if (this.currentPlayer === 0) {
        this.turn++;
      }

      this.phase = GAME_PHASES.PURCHASE;

      return {
        success: true,
        phase: this.phase,
        playerChange: true,
        currentPlayer: this.currentPlayer,
        turn: this.turn
      };
    }
  }

  // Get game state summary
  getState() {
    return {
      gameId: this.gameId,
      turn: this.turn,
      currentPlayer: this.currentPlayer,
      phase: this.phase,
      players: this.players.map(p => ({
        id: p.id,
        nationId: p.nationId,
        currency: p.currency,
        territories: p.territories.length,
        units: p.units.filter(u => u.deployed).length
      })),
      territories: Object.entries(this.territories).map(([id, terr]) => ({
        id,
        name: terr.name,
        owner: terr.owner,
        unitCount: terr.units.length
      }))
    };
  }
}
