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
export async function startTestServer(config: Config = getTestConfig()) {
  const server = await initServer(config);

  await server.listen(config.port);

  return server;
}
