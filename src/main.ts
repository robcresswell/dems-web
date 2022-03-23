/* istanbul ignore file */
import { promises as fsp } from 'fs';
import { resolve } from 'path';
import { initLogger } from './lib/logger';
import { initServer } from './server';
import { assertValidConfig } from './validators/config';

async function main() {
  let config: unknown;
  const isDev = process.env['NODE_ENV'] === 'development';

  try {
    const configFile = resolve(__dirname, '..', 'config.json');
    const configJSON = await fsp.readFile(configFile, { encoding: 'utf8' });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    config = Object.freeze(JSON.parse(configJSON));
  } catch (error) {
    // If we're in dev mode, silently fall back to some minimal defaults to
    // make it easier to get started, otherwise, re-throw the error
    if (isDev) {
      config = {
        HOST: 'http://localhost',
        LOG_LEVEL: 'debug',
      };
    } else {
      throw error;
    }
  }

  assertValidConfig(config);

  const logger = initLogger(config.LOG_LEVEL, isDev);
  const server = await initServer(config, logger);

  try {
    await server.listen({ port: 3000 });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
