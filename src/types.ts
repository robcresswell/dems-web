import {
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RequestBodyDefault,
  RequestParamsDefault,
  RouteHandlerMethod,
  ContextConfigDefault,
  RequestHeadersDefault,
} from 'fastify';

/**
 * A generic "json object" type. Note the top level "Json" type is stricter than
 * the nested "JsonVal" type; this is to allow the type system to enforce Json
 * as an object structure, rather than allowing strings etc.
 */
export type Json = { [property: string]: JsonVal };

type JsonVal =
  | string
  | number
  | boolean
  | null
  | { [property: string]: JsonVal }
  | JsonVal[];

// TypeScript fun!
// - The handlers are all using the same request / reply objects, so rather than
//   declare them on every handler, declare them once here, and only expose
//   the Request type parameter as part of the Handler interface.
// - The fastify types expect capitals, but the schema defintions etc use
//    lowercase, i.e. "Headers" vs "headers". There might be a nicer way of
//    doing this?
type BaseRequest = {
  querystring?: RequestParamsDefault;
  params?: RequestParamsDefault;
  headers?: RequestHeadersDefault;
  body?: RequestBodyDefault;
};

export type Handler<
  Request extends BaseRequest = BaseRequest
> = RouteHandlerMethod<
  RawServerBase,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  {
    Body: Request['body'];
    Headers: Request['headers'];
    Params: Request['params'];
    Querystring: Request['querystring'];
  },
  ContextConfigDefault
>;
