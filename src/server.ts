import * as Fastify from 'fastify';
import { routes } from './routes';
import { Config } from './types';

// Declare types for Fastify with config added
declare module 'fastify' {
  interface FastifyInstance {
    config: Readonly<Config>;
    url: string;
  }
}

export async function initServer(config: Readonly<Config>) {
  const { logger } = config;

  // Grab framework instance, using the injected config
  const fastify = Fastify({ logger });

  // Add local config object to fastify Reply object. Adding it via a server
  // instance, rather than its own config instance, makes it easy to create
  // test servers
  fastify.decorate('config', config);

  // Add a shortcut to get the base URL
  fastify.decorate('url', `${fastify.config.host}:${fastify.config.port}`);

  // Register all defined routes
  routes.forEach((route) => {
    fastify.route(route);
  });

  return fastify;
}
