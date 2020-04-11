import { Config } from '../../src/types';

/**
 * Returns a configuration object. This is the default used in
 * `startTestServer()` if no config is passed
 *
 * @example
 * const defaultConfig = getTestConfig();
 * const myTestConfig = {
 *   ...defaultConfig,
 *   myOverrideKey: 'foo',
 * };
 * const { server } = await startTestServer(myTestConfig);
 */
export function getTestConfig(): Config {
  return Object.freeze({
    host: 'http://127.0.0.1',
    logger: {
      level: 'warn',
      base: null,
      prettyPrint: {
        translateTime: 'HH:MM:ss',
      },
    },
  });
}
