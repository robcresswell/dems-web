import { Config } from '../../src/types';
import { initServer } from '../../src/server';
import { getTestConfig } from './test-config';

/**
 * A helper to start a server and listen on a given port. Can be passed
 * config for easy testing of multiple configurations
 *
 * @param config
 * A configuration object. Defaults to the config in `helpers/test-config`.
 */
export async function startTestServer(config?: Config) {
  let serverConfig = config;

  if (typeof serverConfig === 'undefined') {
    serverConfig = await getTestConfig();
  }

  const server = await initServer(serverConfig);

  await server.listen(serverConfig.port);

  return server;
}
