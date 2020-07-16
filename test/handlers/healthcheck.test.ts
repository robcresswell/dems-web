import { FastifyInstance } from 'fastify';
import { getTestServer } from '../helpers/test-server';

describe('/healthcheck', () => {
  let server: FastifyInstance;

  beforeEach(async () => {
    ({ server } = await getTestServer());
  });

  afterEach(async () => {
    await server.close();
  });

  it('responds to a GET request', async () => {
    const res = await server.inject('/healthcheck');

    expect(res.statusCode).toBe(204);
  });

  it('responds to a HEAD request', async () => {
    const res = await server.inject('/healthcheck');

    expect(res.statusCode).toBe(204);
  });
});
