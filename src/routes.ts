import { healthcheck } from './handlers/healthcheck';

const GET = 'GET' as const;
const HEAD = 'HEAD' as const;

export const routes = [
  {
    method: [HEAD, GET],
    url: '/healthcheck',
    handler: healthcheck,
  },
];
