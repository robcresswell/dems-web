import { startTestServer } from './helpers/test-server';
import { FastifyInstance } from 'fastify';

describe('server initialisation', () => {
  let server: FastifyInstance;

  beforeEach(async () => {
    server = await startTestServer();
  });

  afterEach(async () => {
    await server.close();
  });

  it('can be started', async () => {
    expect(server.server.listening).toBe(true);
  });

  it('has a "url" decorator', () => {
    expect(server.url).toContain('http://127.0.0.1:');
  });

  it('has access to the server config via the "config" decorator', () => {
    // Doesn't need to be an exhaustive check; just assert that we seem to be
    // able to access the server config
    expect(server.config).toMatchObject({});
  });

  it('shuts down gracefully', async () => {
    await server.close();

    expect(server.server.listening).toBe(false);
  });
});
