import * as Fastify from 'fastify';
import * as fastifySwagger from 'fastify-swagger';
import { promises as fsp } from 'fs';
import * as path from 'path';
import { routes } from './routes';
import { Config } from './types';

// Declare types for Fastify with config added
declare module 'fastify' {
  interface FastifyInstance {
    config: Readonly<Config>;
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

  // Read some content from the package.json so we don't need to duplicate it
  const packageJSONString = await fsp.readFile(
    path.join(__dirname, '..', 'package.json'),
    'utf-8',
  );
  const packageJSON = JSON.parse(packageJSONString);
  const { name, description, version } = packageJSON;

  // Register the fastify-swagger plugin, which generates documentation from
  // our JSON schema route validation
  // Docs served at /documentation
  fastify.register(fastifySwagger, {
    exposeRoute: true,
    swagger: {
      info: {
        title: name,
        description,
        version,
      },
    },
  });

  // Register all defined routes
  routes.forEach((route) => {
    fastify.route(route);
  });

  return fastify;
}
