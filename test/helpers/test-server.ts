import { FastifyInstance } from 'fastify';
import * as getPort from 'get-port';
import { initServer } from '../../src/server';
import { Config } from '../../src/types/config';
import { getTestConfig } from './test-config';

/**
 * Instantiates and returns a server instance. This does _not_ start the server
 * and listen to HTTP requests. To interact with the server, use
 * `server.inject`. If you want a running HTTP server, use `startTestServer`
 * instead
 *
 * @param config
 * A configuration object. Defaults to the config in `test/helpers/test-config`
 */
export async function getTestServer(
  config: Readonly<Config> = getTestConfig(),
): Promise<{ server: FastifyInstance }> {
  const server = await initServer(config);

  return { server };
}

/**
 * A helper to start a server. Can be passed config for easy testing of multiple
 * configurations. If no config is passed, the server will use the default
 * config defined in `test/helpers/test-config`, and will automatically find a
 * free port to avoid collisions
 *
 * @param config
 * A configuration object. Defaults to the config in `test/helpers/test-config`
 */
export async function startTestServer(
  config?: Readonly<Config>,
): Promise<{ host: string; server: FastifyInstance }> {
  const { server } = await getTestServer(config);
  const port = await getPort();
  const host = await server.listen(port);

  return { host, server };
}
