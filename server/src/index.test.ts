import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { io as Client, type Socket as ClientSocket } from 'socket.io-client';
import { AddressInfo } from 'net';

// Establecer variables de entorno ANTES de importar app/server
process.env.PRESENTER_SECRET = 'dev-secret-key';
process.env.ALLOWED_ORIGIN = 'http://localhost:5173';

import { server, io } from './index';
import { globalState } from './state/sessionState';

describe('Server Integration', () => {
  let clientSocket: ClientSocket;
  let port: number;

  beforeAll(() => {
    return new Promise((resolve) => {
      server.listen(0, () => {
        port = (server.address() as AddressInfo).port;
        resolve();
      });
    });
  });

  afterAll(() => {
    io.close();
    server.close();
  });

  beforeEach(() => {
    globalState.currentSlideIndex = 0;
    globalState.currentStepIndex = -1;
    globalState.activeTrigger = null;
    globalState.polls.clear();
    
    // Configurar secreto para el test de autorización
    process.env.PRESENTER_SECRET = 'dev-secret-key';

    clientSocket = Client(`http://localhost:${port}`);
  });

  afterEach(() => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
  });

  it('should connect to the server', () => {
    return new Promise<void>((resolve) => {
      clientSocket.on('connect', () => {
        expect(clientSocket.connected).toBe(true);
        resolve();
      });
    });
  });

  it('should receive initial state on connection', () => {
    return new Promise<void>((resolve) => {
      clientSocket.on('audience:sync', (state) => {
        expect(state).toEqual({
          currentSlideIndex: 0,
          currentStepIndex: -1,
          activeTrigger: null
        });
        resolve();
      });
    });
  });

  it('should update state when presenter syncs with correct secret', () => {
    return new Promise<void>((resolve) => {
      const payload = {
        slideIndex: 2,
        stepIndex: 1,
        trigger: 'poll-1',
        secret: 'dev-secret-key'
      };

      clientSocket.emit('presenter:sync', payload);

      clientSocket.on('audience:sync', (state) => {
        if (state.currentSlideIndex === 2) {
          expect(state.currentSlideIndex).toBe(2);
          expect(state.activeTrigger).toBe('poll-1');
          resolve();
        }
      });
    });
  });

  it('should NOT update state when presenter syncs with wrong secret', () => {
    return new Promise<void>((resolve) => {
      const payload = {
        slideIndex: 5,
        stepIndex: 0,
        trigger: 'hacker-trigger',
        secret: 'wrong-secret'
      };

      clientSocket.emit('presenter:sync', payload);

      // We wait a bit to ensure audience:sync is NOT called with the new state
      setTimeout(() => {
        expect(globalState.currentSlideIndex).toBe(0);
        resolve();
      }, 200);
    });
  });

  it('should register audience vote and broadcast results', () => {
    return new Promise<void>((resolve) => {
      // First, set a trigger
      globalState.syncPresenter(1, 0, 'poll-vote');

      const votePayload = {
        triggerId: 'poll-vote',
        uuid: 'user-123',
        option: 'Option A'
      };

      clientSocket.emit('audience:vote', votePayload);

      clientSocket.on('poll:results', (data) => {
        if (data.triggerId === 'poll-vote') {
          expect(data.results).toEqual({ 'Option A': 1 });
          resolve();
        }
      });
    });
  });

  it('should prevent duplicate votes from same UUID', () => {
    return new Promise<void>((resolve) => {
      globalState.syncPresenter(1, 0, 'duplicate-test');

      const vote1 = { triggerId: 'duplicate-test', uuid: 'same-user', option: 'A' };
      const vote2 = { triggerId: 'duplicate-test', uuid: 'same-user', option: 'B' };

      clientSocket.emit('audience:vote', vote1);
      
      setTimeout(() => {
        clientSocket.emit('audience:vote', vote2);
      }, 50);

      clientSocket.on('poll:results', (data) => {
        if (data.results['B'] === 1) {
          expect(data.results['A']).toBe(0);
          resolve();
        }
      });
    });
  });

  it('should count votes from different UUIDs separately', () => {
    return new Promise<void>((resolve) => {
      globalState.syncPresenter(1, 0, 'multi-user-test');

      const vote1 = { triggerId: 'multi-user-test', uuid: 'user-1', option: 'A' };
      const vote2 = { triggerId: 'multi-user-test', uuid: 'user-2', option: 'A' };

      clientSocket.emit('audience:vote', vote1);
      
      // Use a second socket or just emit from same socket with different UUID
      // The server uses the UUID in payload, so it should work from same socket
      setTimeout(() => {
        clientSocket.emit('audience:vote', vote2);
      }, 50);

      clientSocket.on('poll:results', (data) => {
        if (data.results['A'] === 2) {
          resolve();
        }
      });
    });
  });
});
