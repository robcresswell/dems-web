import { startTestServer } from '../helpers/test-server';
import { FastifyInstance } from 'fastify';
import got from 'got';

describe('/healthcheck', () => {
  let server: FastifyInstance;
  let host: string;

  beforeEach(async () => {
    ({ server, host } = await startTestServer());
  });

  afterEach(async () => {
    await server.close();
  });

  it('responds to a GET request', async () => {
    const res = await got.get(`${host}/healthcheck`);

    expect(res.statusCode).toBe(204);
  });

  it('responds to a HEAD request', async () => {
    const res = await got.head(`${host}/healthcheck`);

    expect(res.statusCode).toBe(204);
  });
});
