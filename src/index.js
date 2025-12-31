/**
 * Ultimate Risk - WW2 Strategy Game
 * A turn-based strategy war game set in World War 2
 */

import { GameState } from './gameLogic.js';
import { NATIONS, TERRITORIES } from './gameData.js';

// In-memory game storage (in production, use Durable Objects or KV)
const games = new Map();

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS headers for API
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Route handling
    if (url.pathname === '/') {
      return handleHome(request);
    } else if (url.pathname === '/api/game/new') {
      return handleNewGame(request, corsHeaders);
    } else if (url.pathname === '/api/game/state') {
      return handleGameState(request, corsHeaders);
    } else if (url.pathname === '/api/game/purchase') {
      return handlePurchase(request, corsHeaders);
    } else if (url.pathname === '/api/game/deploy') {
      return handleDeploy(request, corsHeaders);
    } else if (url.pathname === '/api/game/move') {
      return handleMove(request, corsHeaders);
    } else if (url.pathname === '/api/game/combat') {
      return handleCombat(request, corsHeaders);
    } else if (url.pathname === '/api/game/next-phase') {
      return handleNextPhase(request, corsHeaders);
    } else if (url.pathname === '/api/nations') {
      return handleNations(request, corsHeaders);
    } else if (url.pathname === '/api/territories') {
      return handleTerritories(request, corsHeaders);
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  },
};

async function handleHome(request) {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ultimate Risk - WW2 Strategy Game</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            min-height: 100vh;
          }
          .nation-card {
            transition: transform 0.2s;
          }
          .nation-card:hover {
            transform: scale(1.05);
          }
          .territory-hex {
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          }
        </style>
      </head>
      <body class="text-white">
        <!-- Background Audio -->
        <audio id="bgMusic" loop>
          <source src="data:audio/mpeg;base64," type="audio/mpeg">
          <!-- Note: In production, host the Erika Marschlied audio file -->
        </audio>

        <div class="container mx-auto px-4 py-8">
          <!-- Header -->
          <header class="text-center mb-12">
            <h1 class="text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent">
              🎖️ ULTIMATE RISK
            </h1>
            <p class="text-2xl text-gray-300">World War II Strategy Command</p>
            <p class="text-lg text-gray-400 mt-2">European Theatre - Turn-Based Warfare</p>
          </header>

          <!-- Game Controls -->
          <div class="max-w-4xl mx-auto mb-8">
            <div class="bg-gray-800 rounded-lg p-6 shadow-2xl">
              <h2 class="text-2xl font-bold mb-4">🎮 Game Controls</h2>
              <div class="flex gap-4 flex-wrap">
                <button onclick="newGame()" class="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-bold transition">
                  🚀 New Game
                </button>
                <button onclick="toggleMusic()" class="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold transition">
                  🎵 Toggle Music
                </button>
                <button onclick="nextPhase()" class="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg font-bold transition">
                  ⏭️ Next Phase
                </button>
              </div>
            </div>
          </div>

          <!-- Game Status -->
          <div id="gameStatus" class="max-w-4xl mx-auto mb-8 bg-gray-800 rounded-lg p-6 shadow-2xl hidden">
            <h2 class="text-2xl font-bold mb-4">📊 Game Status</h2>
            <div id="statusContent" class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Dynamic content -->
            </div>
          </div>

          <!-- Nations -->
          <div class="max-w-6xl mx-auto mb-8">
            <h2 class="text-3xl font-bold mb-6 text-center">🌍 Nations at War</h2>
            <div id="nationsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Nations will be loaded dynamically -->
            </div>
          </div>

          <!-- Game Board -->
          <div class="max-w-6xl mx-auto">
            <h2 class="text-3xl font-bold mb-6 text-center">🗺️ European Theatre</h2>
            <div id="gameBoard" class="bg-gray-800 rounded-lg p-6 shadow-2xl">
              <div id="territoriesGrid" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <!-- Territories will be loaded dynamically -->
              </div>
            </div>
          </div>

          <!-- Unit Purchase Panel -->
          <div id="purchasePanel" class="max-w-4xl mx-auto mt-8 bg-gray-800 rounded-lg p-6 shadow-2xl hidden">
            <h2 class="text-2xl font-bold mb-4">💰 Purchase Units</h2>
            <div id="purchaseContent" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Dynamic unit cards -->
            </div>
          </div>

          <!-- Footer -->
          <footer class="text-center mt-12 text-gray-400">
            <p class="mb-2">Created with ⚔️ by Claude Code</p>
            <p class="text-sm">Deployed on Cloudflare Workers Edge Network</p>
          </footer>
        </div>

        <script>
          let currentGame = null;
          let musicPlaying = false;

          // Initialize
          async function init() {
            await loadNations();
            await loadTerritories();
          }

          // Load nations data
          async function loadNations() {
            try {
              const response = await fetch('/api/nations');
              const nations = await response.json();

              const grid = document.getElementById('nationsGrid');
              grid.innerHTML = '';

              Object.values(nations).forEach(nation => {
                const card = document.createElement('div');
                card.className = 'nation-card bg-gray-700 rounded-lg p-6 shadow-lg cursor-pointer';
                card.style.borderTop = \`4px solid \${nation.color}\`;
                card.innerHTML = \`
                  <h3 class="text-xl font-bold mb-2">\${nation.name}</h3>
                  <div class="mb-4">
                    <p class="text-sm text-gray-300">Leader: \${nation.leader.name}</p>
                    <p class="text-xs text-gray-400">\${nation.leader.title}</p>
                  </div>
                  <div class="text-sm space-y-1">
                    <p>💰 Starting: \${nation.startingCurrency}</p>
                    <p>⚔️ Infantry: \${nation.units.infantry.name}</p>
                    <p>🚗 Vehicle: \${nation.units.vehicle.name}</p>
                    <p>⛴️ Naval: \${nation.units.naval.name}</p>
                    <p>✈️ Aircraft: \${nation.units.aircraft.name}</p>
                  </div>
                \`;
                grid.appendChild(card);
              });
            } catch (error) {
              console.error('Failed to load nations:', error);
            }
          }

          // Load territories
          async function loadTerritories() {
            try {
              const response = await fetch('/api/territories');
              const territories = await response.json();

              const grid = document.getElementById('territoriesGrid');
              grid.innerHTML = '';

              Object.entries(territories).forEach(([id, territory]) => {
                const tile = document.createElement('div');
                const bgColor = territory.type === 'sea' ? 'bg-blue-900' :
                                territory.type === 'island' ? 'bg-green-800' : 'bg-green-700';
                tile.className = \`\${bgColor} rounded-lg p-3 shadow-md hover:shadow-xl transition cursor-pointer\`;
                tile.innerHTML = \`
                  <div class="text-xs font-bold mb-1">\${territory.name}</div>
                  <div class="text-xs text-gray-300">Value: \${territory.value}</div>
                  <div class="text-xs text-gray-400">\${territory.owner || 'Neutral'}</div>
                \`;
                grid.appendChild(tile);
              });
            } catch (error) {
              console.error('Failed to load territories:', error);
            }
          }

          // Create new game
          async function newGame() {
            try {
              const response = await fetch('/api/game/new', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  players: ['germany', 'britain', 'usa', 'russia']
                })
              });

              const data = await response.json();
              currentGame = data.gameId;

              alert('New game started! Game ID: ' + currentGame);
              await updateGameStatus();

              // Show purchase panel
              document.getElementById('purchasePanel').classList.remove('hidden');

            } catch (error) {
              console.error('Failed to create game:', error);
              alert('Failed to create game. Check console for details.');
            }
          }

          // Update game status display
          async function updateGameStatus() {
            if (!currentGame) return;

            try {
              const response = await fetch(\`/api/game/state?gameId=\${currentGame}\`);
              const state = await response.json();

              const statusDiv = document.getElementById('gameStatus');
              const contentDiv = document.getElementById('statusContent');

              statusDiv.classList.remove('hidden');
              contentDiv.innerHTML = \`
                <div class="bg-gray-700 p-4 rounded">
                  <p class="font-bold">Turn: \${state.turn}</p>
                  <p class="text-sm text-gray-300">Phase: \${state.phase}</p>
                </div>
                <div class="bg-gray-700 p-4 rounded">
                  <p class="font-bold">Current Player: \${state.currentPlayer}</p>
                  <p class="text-sm text-gray-300">Active Players: \${state.players.length}</p>
                </div>
                <div class="bg-gray-700 p-4 rounded">
                  <p class="font-bold">Territories: \${state.territories.length}</p>
                  <p class="text-sm text-gray-300">Contested: 0</p>
                </div>
              \`;
            } catch (error) {
              console.error('Failed to update status:', error);
            }
          }

          // Advance to next phase
          async function nextPhase() {
            if (!currentGame) {
              alert('Please start a new game first!');
              return;
            }

            try {
              const response = await fetch('/api/game/next-phase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gameId: currentGame })
              });

              const data = await response.json();
              alert(\`Advanced to: \${data.phase}\` + (data.playerChange ? ' (Next Player)' : ''));
              await updateGameStatus();
            } catch (error) {
              console.error('Failed to advance phase:', error);
            }
          }

          // Toggle background music
          function toggleMusic() {
            const audio = document.getElementById('bgMusic');
            if (musicPlaying) {
              audio.pause();
              musicPlaying = false;
            } else {
              audio.play().catch(e => {
                console.log('Audio playback failed:', e);
                alert('Music playback requires user interaction. Please try again.');
              });
              musicPlaying = true;
            }
          }

          // Initialize on load
          init();
        </script>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  });
}

// API Handlers

async function handleNewGame(request, corsHeaders) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const playerNations = body.players || ['germany', 'britain', 'usa', 'russia'];

    const game = new GameState(playerNations);
    games.set(game.gameId, game);

    return new Response(JSON.stringify({
      success: true,
      gameId: game.gameId,
      state: game.getState()
    }), {
      headers: {
        'content-type': 'application/json',
        ...corsHeaders
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 400,
      headers: {
        'content-type': 'application/json',
        ...corsHeaders
      },
    });
  }
}

async function handleGameState(request, corsHeaders) {
  const url = new URL(request.url);
  const gameId = url.searchParams.get('gameId');

  if (!gameId) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Missing gameId parameter'
    }), {
      status: 400,
      headers: {
        'content-type': 'application/json',
        ...corsHeaders
      },
    });
  }

  const game = games.get(gameId);
  if (!game) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Game not found'
    }), {
      status: 404,
      headers: {
        'content-type': 'application/json',
        ...corsHeaders
      },
    });
  }

  return new Response(JSON.stringify(game.getState()), {
    headers: {
      'content-type': 'application/json',
      ...corsHeaders
    },
  });
}

async function handlePurchase(request, corsHeaders) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { gameId, playerId, unitType, quantity } = body;

    const game = games.get(gameId);
    if (!game) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Game not found'
      }), {
        status: 404,
        headers: {
          'content-type': 'application/json',
          ...corsHeaders
        },
      });
    }

    const result = game.purchaseUnit(playerId, unitType, quantity || 1);

    return new Response(JSON.stringify(result), {
      headers: {
        'content-type': 'application/json',
        ...corsHeaders
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 400,
      headers: {
        'content-type': 'application/json',
        ...corsHeaders
      },
    });
  }
}

async function handleDeploy(request, corsHeaders) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { gameId, playerId, unitId, territoryId } = body;

    const game = games.get(gameId);
    if (!game) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Game not found'
      }), {
        status: 404,
        headers: {
          'content-type': 'application/json',
          ...corsHeaders
        },
      });
    }

    const result = game.deployUnit(playerId, unitId, territoryId);

    return new Response(JSON.stringify(result), {
      headers: {
        'content-type': 'application/json',
        ...corsHeaders
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 400,
      headers: {
        'content-type': 'application/json',
        ...corsHeaders
      },
    });
  }
}

async function handleMove(request, corsHeaders) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { gameId, playerId, unitId, fromTerritory, toTerritory } = body;

    const game = games.get(gameId);
    if (!game) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Game not found'
      }), {
        status: 404,
        headers: {
          'content-type': 'application/json',
          ...corsHeaders
        },
      });
    }

    const result = game.moveUnit(playerId, unitId, fromTerritory, toTerritory);

    return new Response(JSON.stringify(result), {
      headers: {
        'content-type': 'application/json',
        ...corsHeaders
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 400,
      headers: {
        'content-type': 'application/json',
        ...corsHeaders
      },
    });
  }
}

async function handleCombat(request, corsHeaders) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { gameId, territoryId } = body;

    const game = games.get(gameId);
    if (!game) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Game not found'
      }), {
        status: 404,
        headers: {
          'content-type': 'application/json',
          ...corsHeaders
        },
      });
    }

    const result = game.resolveCombat(territoryId);

    return new Response(JSON.stringify(result), {
      headers: {
        'content-type': 'application/json',
        ...corsHeaders
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 400,
      headers: {
        'content-type': 'application/json',
        ...corsHeaders
      },
    });
  }
}

async function handleNextPhase(request, corsHeaders) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { gameId } = body;

    const game = games.get(gameId);
    if (!game) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Game not found'
      }), {
        status: 404,
        headers: {
          'content-type': 'application/json',
          ...corsHeaders
        },
      });
    }

    const result = game.nextPhase();

    return new Response(JSON.stringify(result), {
      headers: {
        'content-type': 'application/json',
        ...corsHeaders
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 400,
      headers: {
        'content-type': 'application/json',
        ...corsHeaders
      },
    });
  }
}

async function handleNations(request, corsHeaders) {
  return new Response(JSON.stringify(NATIONS), {
    headers: {
      'content-type': 'application/json',
      ...corsHeaders
    },
  });
}

async function handleTerritories(request, corsHeaders) {
  return new Response(JSON.stringify(TERRITORIES), {
    headers: {
      'content-type': 'application/json',
      ...corsHeaders
    },
  });
}
