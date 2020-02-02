import { resolve } from 'path';
import { readFileSync } from 'fs';
import { Config } from './types';
import { initServer } from './server';
import * as dotenv from 'dotenv';
import { closeDatabaseConnection } from './hooks';

/**
 * Triggers all side effects as part of the init process. Isolating this to
 * a single IIAFE makes testing much easier, as any tests can manually control
 * the DB and server, as well as their configs.
 */
(async function() {
  const configFile = resolve(__dirname, '..', 'config.json');
  const configJSON = readFileSync(configFile, { encoding: 'utf8' });
  const config: Readonly<Config> = Object.freeze(JSON.parse(configJSON));

  const server = await initServer(config);

  server.addHook('onClose', closeDatabaseConnection);

  // Mutates `process.env` with values in local `.env` file
  dotenv.config();

  try {
    await server.listen(config.port);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
})();
