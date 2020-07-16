import { healthcheck } from './handlers/healthcheck';
import * as healthcheckSchema from './schemas/healthcheck.json';

const GET = 'GET' as const;
const HEAD = 'HEAD' as const;

export const routes = [
  {
    method: [HEAD, GET],
    url: '/healthcheck',
    schema: healthcheckSchema,
    handler: healthcheck,
  },
];
