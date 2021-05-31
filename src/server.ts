import { fastify, FastifyInstance, FastifyLoggerOptions } from 'fastify';
import fastifySwagger from 'fastify-swagger';
import { validateAgainstSchema } from './lib/validate-against-schema';
import { routes } from './routes';
import * as configSchema from './schemas/config.json';
import type { Config } from './types/config';

// Declare types for Fastify with config added
declare module 'fastify' {
  interface FastifyInstance {
    config: Readonly<Config>;
  }
}

export async function initServer(
  configBeforeValidation: unknown,
): Promise<FastifyInstance> {
  const configValidationResult = validateAgainstSchema<Config>(
    configSchema,
    configBeforeValidation,
  );

  if ('error' in configValidationResult) {
    throw new Error(configValidationResult.error.message);
  }

  const config = configValidationResult.data;
  const isDev =
    process.env['NODE_ENV'] === 'development' ||
    process.env['NODE_ENV'] === 'test';

  /* istanbul ignore next */
  const prettyPrint = isDev ? { translateTime: 'HH:MM:ss' } : false;
  /* istanbul ignore next */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const logLevel = config.LOG_LEVEL ?? (isDev ? 'debug' : 'info');

  const server = fastify({
    logger: {
      name: '{{ name }}',
      base: { name: '{{ name }}' },
      prettyPrint,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      level: logLevel,
    } as FastifyLoggerOptions,
  });

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
