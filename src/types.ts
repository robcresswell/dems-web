import { ServerOptions } from 'fastify';

export interface Config extends ServerOptions {
  host: string;
}
