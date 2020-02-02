import { Config } from '../../src/types';

const usedPorts: Set<number> = new Set();

function generateUniquePort(): number {
  let port = Math.floor(Math.random() * 50000) + 5000;

  while (usedPorts.has(port)) {
    port = generateUniquePort();
  }

  usedPorts.add(port);

  return port;
}

/**
 * Returns a frozen configuration object
 */
export function getTestConfig(): Readonly<Config> {
  const port = generateUniquePort();

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
