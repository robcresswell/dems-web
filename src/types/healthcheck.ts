/* istanbul ignore file */
/* eslint-disable @typescript-eslint/no-empty-interface,@typescript-eslint/ban-types */

// DO NOT MANUALLY EDIT THIS FILE
//
// To update it:
// 1) Edit 'src/schemas/healthcheck.json'
// 2) Run './scripts/generate-types.ts'

export interface Healthcheck {
  body: unknown;
  headers: unknown;
  params: unknown;
  query: unknown;
  reply: {
    [k: string]: unknown;
  };
}
