import * as getPort from 'get-port';
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
export async function startTestServer(config: Config = getTestConfig()) {
  const server = initServer(config);
  const port = await getPort();

  const host = await server.listen(port);

  return { host, server };
}
