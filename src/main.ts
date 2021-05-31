/* istanbul ignore file */
import { promises as fsp } from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';
import { initServer } from './server';

async function main() {
  let config: unknown;

  try {
    const configFile = resolve(__dirname, '..', 'config.json');
    const configJSON = await fsp.readFile(configFile, { encoding: 'utf8' });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    config = Object.freeze(JSON.parse(configJSON));
  } catch (error) {
    // If we're in dev mode, silently fall back to some minimal defaults to
    // make it easier to get started, otherwise, re-throw the error
    if (process.env['NODE_ENV'] === 'development') {
      config = {
        HOST: 'http://localhost',
        LOG_LEVEL: 'debug',
      };
    } else {
      throw error;
    }
  }

  const server = await initServer(config);

  // Mutates `process.env` with values in local `.env` file. This means we can
  // avoid storing secrets in global environment variables, and instead keep
  // them scoped to this project
  dotenv.config();

  try {
    await server.listen(3000);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
