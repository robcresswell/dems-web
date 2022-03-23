import { fastify, FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import type { Logger } from 'pino';
import { routes } from './routes';
import type { Config } from './validators/config';

// Declare types for Fastify with config added
declare module 'fastify' {
  interface FastifyInstance {
    config: Readonly<Config>;
  }
}

export async function initServer(
  config: Config,
  logger: Logger,
): Promise<FastifyInstance> {
  const server = fastify({ logger });

  server.decorate('config', config);

  await server.register(fastifySwagger, {
    exposeRoute: true,
    swagger: {
      info: {
        title: process.env['npm_package_name'] ?? '',
        version: process.env['npm_package_version'] ?? '',
        description: process.env['npm_package_description'],
      },
    },
  });

  // Register all defined routes
  routes.forEach((route) => {
    server.route(route);
  });

  return server;
}
