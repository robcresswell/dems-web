import type { Handler } from '../types';
import type { Healthcheck } from '../types/healthcheck';

export const healthcheck: Handler<Healthcheck> = async function (_req, reply) {
  return reply.code(204).send();
};
