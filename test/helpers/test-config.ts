import { Config } from '../../src/types';
import * as getPort from 'get-port';

/**
 * Returns a frozen configuration object
 */
export async function getTestConfig(): Promise<Readonly<Config>> {
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
