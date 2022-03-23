import type { Handler } from '../types';

export const healthcheck: Handler = async function (_req, reply) {
  return reply.code(204).send();
};
