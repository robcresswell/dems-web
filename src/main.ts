import { resolve } from 'path';
import { readFileSync } from 'fs';
import { Config } from './types';
import { initServer } from './server';
import * as dotenv from 'dotenv';

/**
 * Triggers all side effects as part of the init process. Isolating this to
 * a single IIAFE makes testing much easier, as any tests can manually control
 * the DB and server, as well as their configs.
 */
(async function() {
  let config: Readonly<Config>;

  try {
    const configFile = resolve(__dirname, '..', 'config.json');
    const configJSON = readFileSync(configFile, { encoding: 'utf8' });
    config = Object.freeze(JSON.parse(configJSON));
  } catch (error) {
    // If we're in dev mode, silently fall back to some minimal defaults to
    // make it easier to get started, otherwise, re-throw the error
    if (process.env.NODE_ENV === 'development') {
      config = {
        host: 'http://localhost',
        port: 3000,
        logger: {
          level: 'debug',
          base: null,
          prettyPrint: {
            translateTime: 'HH:MM:ss',
          },
        },
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
    await server.listen(config.port ?? 3000);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
})();
