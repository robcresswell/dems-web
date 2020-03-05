import * as Fastify from 'fastify';
import { routes } from './routes';
import { Config } from './types';
import { AddressInfo } from 'net';

// Declare types for Fastify with config added
declare module 'fastify' {
  interface FastifyInstance {
    config: Readonly<Config>;
    url: string;
  }
}

function isAddressInfo(
  addressResult: string | AddressInfo | null,
): addressResult is AddressInfo {
  return addressResult !== null && typeof addressResult !== 'string';
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
  const addressResult = fastify.server.address();

  if (addressResult === null) {
    throw new Error('Server has no address, for some weird reason');
  }

  if (isAddressInfo(addressResult)) {
    const { port } = addressResult;
    fastify.decorate('url', `${config.host}:${port}`);
  } else {
    fastify.decorate('url', `${addressResult}`);
  }

  // Register all defined routes
  routes.forEach((route) => {
    fastify.route(route);
  });

  return fastify;
}
