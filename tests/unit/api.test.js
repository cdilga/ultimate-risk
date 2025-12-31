/**
 * Unit tests for API endpoints
 */

import { describe, it, expect } from 'vitest';
import worker from '../../src/index.js';

describe('API Endpoints', () => {
  it('should return nations data', async () => {
    const request = new Request('http://localhost/api/nations');
    const response = await worker.fetch(request, {}, {});

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.GERMANY).toBeDefined();
    expect(data.BRITAIN).toBeDefined();
    expect(data.USA).toBeDefined();
    expect(data.RUSSIA).toBeDefined();
  });

  it('should return territories data', async () => {
    const request = new Request('http://localhost/api/territories');
    const response = await worker.fetch(request, {}, {});

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.GERMANY_WEST).toBeDefined();
    expect(data.BRITAIN_HOME).toBeDefined();
    expect(data.FRANCE_NORTH).toBeDefined();
  });

  it('should create a new game', async () => {
    const request = new Request('http://localhost/api/game/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ players: ['germany', 'britain'] })
    });

    const response = await worker.fetch(request, {}, {});

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.gameId).toBeDefined();
    expect(data.state).toBeDefined();
    expect(data.state.players.length).toBe(2);
  });

  it('should handle CORS preflight requests', async () => {
    const request = new Request('http://localhost/api/game/new', {
      method: 'OPTIONS'
    });

    const response = await worker.fetch(request, {}, {});

    expect(response.status).toBe(200);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('should return 404 for unknown routes', async () => {
    const request = new Request('http://localhost/api/unknown');
    const response = await worker.fetch(request, {}, {});

    expect(response.status).toBe(404);
  });

  it('should serve HTML for home page', async () => {
    const request = new Request('http://localhost/');
    const response = await worker.fetch(request, {}, {});

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/html');

    const html = await response.text();
    expect(html).toContain('ULTIMATE RISK');
    expect(html).toContain('World War II Strategy Command');
  });
});
