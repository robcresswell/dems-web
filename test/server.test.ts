import type { FastifyInstance } from 'fastify';
import { startTestServer } from './helpers/test-server';

describe('server initialisation', () => {
  let server: FastifyInstance;

  beforeEach(async () => {
    ({ server } = await startTestServer());
  });

  afterEach(async () => {
    await server.close();
  });

  it('can be started', () => {
    expect(server.server.listening).toBe(true);
  });

  it('has access to the server config via the "config" decorator', () => {
    // Doesn't need to be an exhaustive check; just assert that we seem to be
    // able to access the server config
    expect(server.config).toMatchObject({
      HOST: expect.any(String),
      LOG_LEVEL: expect.any(String),
    });
  });

  it('shuts down gracefully', async () => {
    await server.close();

    expect(server.server.listening).toBe(false);
  });
});
