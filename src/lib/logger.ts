import pino from 'pino';

let logger: pino.Logger | undefined;

export function initLogger(
  level: pino.Level = 'info',
  isDev: boolean,
): pino.Logger {
  if (logger) throw new Error('Logger was already initialised');

  logger = pino({
    name: '{{ name }}',
    base: { name: '{{ name }}' },
    transport: isDev
      ? {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss',
          },
        }
      : {
          target: 'pino/file',
        },
    level,
  });

  return logger;
}

export function getLogger(): pino.Logger {
  if (!logger) throw new Error('Logger not initialised!');

  return logger;
}
