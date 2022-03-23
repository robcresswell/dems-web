import type { JSONSchemaType } from 'ajv';
import AJV from 'ajv';

const ajv = new AJV();

export function assertValidConfig(data: unknown): asserts data is Config {
  const validate = ajv.compile(ConfigSchema);
  if (!validate(data)) {
    throw new Error(
      validate.errors
        ? validate.errors.map(({ message }) => message ?? '').join('\n')
        : 'Unknown validation message',
    );
  }
}

export type Config = {
  HOST: string;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
};

const ConfigSchema: JSONSchemaType<Config> = {
  type: 'object',
  required: ['HOST', 'LOG_LEVEL'],
  additionalProperties: false,
  properties: {
    HOST: {
      type: 'string',
    },
    LOG_LEVEL: {
      type: 'string',
      enum: ['debug', 'info', 'warn', 'error', 'fatal'],
    },
  },
};
