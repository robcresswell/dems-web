import { RouteOptions } from 'fastify';
import { healthcheck, healthcheckSchema } from './handlers/healthcheck';

export const routes: RouteOptions[] = [
  {
    method: ['HEAD', 'GET'],
    url: '/healthcheck',
    schema: healthcheckSchema,
    handler: healthcheck,
  },
];
