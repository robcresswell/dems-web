import { Config } from '../../src/types';
/**
 * Returns a frozen configuration object
 */
export function getTestConfig(): Readonly<Config> {
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
