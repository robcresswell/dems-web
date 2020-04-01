import { initServer } from '../../src/server';
import { Config } from '../../src/types';
import { getTestConfig } from './test-config';

/**
 * A helper to start a server and listen on a given port. Can be passed
 * config for easy testing of multiple configurations
 *
 * @param config
 * A configuration object. Defaults to the config in `helpers/test-config`.
 */
export async function startTestServer(config?: Config) {
  const testConfig = config ?? (await getTestConfig());

  const server = await initServer(testConfig);

  const host = await server.listen(testConfig.port);

  return { host, server };
}
