import { Config } from '../../src/types/config';

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
export function getTestConfig(): Config {
  return {
    HOST: 'http://127.0.0.1',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-explicit-any
    LOG_LEVEL: (process.env.LOG_LEVEL as any) ?? 'fatal',
  };
}
