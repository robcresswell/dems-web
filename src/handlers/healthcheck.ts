import { RequestHandler, RouteSchema } from 'fastify';

export const healthcheck: RequestHandler = async function (_req, reply) {
  return reply.code(204).send();
};

export const healthcheckSchema: RouteSchema = {
  response: {
    204: {
      description: 'Success',
      type: 'object',
    },
  },
};
