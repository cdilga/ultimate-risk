/**
 * Unit tests for game logic
 */

import { describe, it, expect } from 'vitest';
import { GameState } from '../../src/gameLogic.js';

describe('GameState', () => {
  it('should create a new game with default players', () => {
    const game = new GameState();

    expect(game.gameId).toBeDefined();
    expect(game.turn).toBe(1);
    expect(game.currentPlayer).toBe(0);
    expect(game.players.length).toBe(4);
  });

  it('should initialize players with starting currency', () => {
    const game = new GameState(['germany', 'britain']);

    expect(game.players[0].currency).toBe(1000); // Germany
    expect(game.players[1].currency).toBe(1000); // Britain
  });

  it('should allow purchasing units', () => {
    const game = new GameState(['germany']);
    const player = game.players[0];
    const initialCurrency = player.currency;

    const result = game.purchaseUnit(0, 'infantry', 1);

    expect(result.success).toBe(true);
    expect(player.currency).toBeLessThan(initialCurrency);
    expect(player.units.length).toBe(1);
  });

  it('should prevent purchasing units with insufficient funds', () => {
    const game = new GameState(['germany']);
    const player = game.players[0];
    player.currency = 50; // Not enough for most units

    const result = game.purchaseUnit(0, 'vehicle', 1);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Insufficient funds');
  });

  it('should advance game phases correctly', () => {
    const game = new GameState(['germany', 'britain']);

    expect(game.phase).toBe('purchase');

    game.nextPhase();
    expect(game.phase).toBe('combat');

    game.nextPhase();
    expect(game.phase).toBe('movement');

    game.nextPhase();
    expect(game.phase).toBe('collect_income');
  });

  it('should advance to next player after all phases', () => {
    const game = new GameState(['germany', 'britain']);

    expect(game.currentPlayer).toBe(0);

    // Go through all phases
    game.nextPhase(); // combat
    game.nextPhase(); // movement
    game.nextPhase(); // collect_income
    const result = game.nextPhase(); // back to purchase, next player

    expect(result.playerChange).toBe(true);
    expect(game.currentPlayer).toBe(1);
    expect(game.phase).toBe('purchase');
  });

  it('should collect income based on controlled territories', () => {
    const game = new GameState(['germany']);
    const player = game.players[0];
    const initialCurrency = player.currency;

    const result = game.collectIncome(0);

    expect(result.success).toBe(true);
    expect(result.income).toBeGreaterThan(0);
    expect(player.currency).toBeGreaterThan(initialCurrency);
  });

  it('should deploy units to controlled territories', () => {
    const game = new GameState(['germany']);

    // Purchase a unit first
    game.purchaseUnit(0, 'infantry', 1);
    const unit = game.players[0].units[0];

    // Deploy to a German-controlled territory
    const result = game.deployUnit(0, unit.id, 'germany_west');

    expect(result.success).toBe(true);
    expect(unit.deployed).toBe(true);
    expect(unit.territoryId).toBe('germany_west');
  });

  it('should prevent deploying to uncontrolled territories', () => {
    const game = new GameState(['germany']);

    game.purchaseUnit(0, 'infantry', 1);
    const unit = game.players[0].units[0];

    // Try to deploy to British territory
    const result = game.deployUnit(0, unit.id, 'britain_home');

    expect(result.success).toBe(false);
    expect(result.error).toContain('do not control');
  });

  it('should get game state summary', () => {
    const game = new GameState(['germany', 'britain']);
    const state = game.getState();

    expect(state.gameId).toBe(game.gameId);
    expect(state.turn).toBe(1);
    expect(state.players.length).toBe(2);
    expect(state.territories.length).toBeGreaterThan(0);
  });
});
