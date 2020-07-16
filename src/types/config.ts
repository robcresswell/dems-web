/* istanbul ignore file */
/* eslint-disable @typescript-eslint/no-empty-interface */

// DO NOT MANUALLY EDIT THIS FILE
//
// To update it:
// 1) Edit 'src/schemas/config.json'
// 2) Run './scripts/generate-types.ts'

export interface Config {
  HOST: string;
  LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
}
