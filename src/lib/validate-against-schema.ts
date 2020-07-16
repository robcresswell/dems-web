import * as AJV from 'ajv';
import { Json } from '../types';

export type SchemaValidationResult<T> =
  | { error: { message: string } }
  | { data: T };

/**
 * Validates an input against a JSON schema. If valid, the result is cast
 * from unknown to a given type; if invalid, an error is returned
 *
 * @param schema A v7 JSON schema
 * @param data Any data; this will be validated against the schema
 */
export function validateAgainstSchema<T>(
  schema: Json,
  data: unknown,
): SchemaValidationResult<T> {
  const ajv = new AJV();
  const isValid = ajv.validate(schema, data) as boolean;

  if (isValid) {
    return { data: data as T };
  }

  const firstError = (ajv.errors as AJV.ErrorObject[])[0];
  const errorString =
    firstError?.message ?? 'has an unknown schema validation error';

  return {
    error: {
      message: `${firstError.dataPath || 'Input'} ${errorString}`,
    },
  };
}
