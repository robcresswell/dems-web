import { RouteOptions } from 'fastify';
import { validateAgainstSchema } from '../lib/validate-against-schema';
import { Json } from '../types';

/**
 * Validate a response against a schema before sending it. This has a
 * performance impact, and should only be used in development.
 *
 * Internally, Fastify uses the response schema to create a function to quickly
 * serialise responses, but it does not validate the shape. This can cause the
 * response to silently drop fields from the handlers return value if you are
 * unfamiliar with the workflow.
 */
export function validateResponse(routeOpts: RouteOptions): void {
  const responseSchema = routeOpts?.schema?.response as Json;

  if (responseSchema) {
    if (!routeOpts.preSerialization) {
      routeOpts.preSerialization = [];
    } else if (!Array.isArray(routeOpts.preSerialization)) {
      routeOpts.preSerialization = [routeOpts.preSerialization];
    }

    routeOpts.preSerialization.push((_req, reply, payload, next) => {
      const statusSchema = responseSchema[reply.statusCode] as Json;

      if (statusSchema) {
        try {
          const res = validateAgainstSchema(statusSchema, payload);

          if ('error' in res) {
            throw new Error(
              `The response returned by the route handler does not that match the reponse defined in the route schema: ${res.error.message}`,
            );
          }
        } catch (err) {
          next(err);
        }
      }
      next(null, payload);
    });
  }
}
