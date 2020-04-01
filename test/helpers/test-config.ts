import * as getPort from 'get-port';
import { Config } from '../../src/types';

/**
 * Returns a configuration object. This is the default used in
 * `startTestServer()` if no config is passed
 *
 * @example
 * const defaultConfig = await getTestConfig();
 * const myTestConfig = {
 *   ...defaultConfig,
 *   myOverrideKey: 'foo',
 * };
 * const { server } = await startTestServer(myTestConfig);
 */
export async function getTestConfig(): Promise<Config> {
  const port = await getPort();

  return Object.freeze({
    host: 'http://127.0.0.1',
    port,
    logger: {
      level: 'warn',
      base: null,
      prettyPrint: {
        translateTime: 'HH:MM:ss',
      },
    },
  });
}
