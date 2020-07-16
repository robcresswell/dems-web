#!/usr/bin/env -S node -r ts-node/register

import { compile } from 'json-schema-to-typescript';
import { promises as fsp } from 'fs';
import * as path from 'path';
import * as globby from 'globby';

// Some colour utilities for the output
export const reset = '\x1b[0m';
const green = (str: string) => `\x1b[32m✓ ${str}${reset}`;
const red = (str: string) => `\x1b[31m⨯ ${str}${reset}`;

async function loadJSON(path: string) {
  const fileStr = await fsp.readFile(path, { encoding: 'utf-8' });
  return JSON.parse(fileStr);
}

function generateBannerComment(schemaFilePath: string) {
  const bannerComment = `/* istanbul ignore file */
  /* eslint-disable @typescript-eslint/no-empty-interface */

  // DO NOT MANUALLY EDIT THIS FILE
  //
  // To update it:
  // 1) Edit '${schemaFilePath}'
  // 2) Run './scripts/generate-types.ts'`;

  return bannerComment;
}

// Fastify route schemas have several fields that aren't useful to encode into
// types, such as the summary, or tags. Rather than generate noise in the type
// defs, exclude these fields during type generation
const excludeFields = [
  'summary',
  'tags',
  'response',
  'type',
  'required',
  'additionalProperties',
];

/**
 * Takes an object, and removes the supplied field names from it
 */
function omit(obj: { [key: string]: any }, fields: string[]) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !fields.includes(key)),
  );
}

/**
 * Generates types from json files found in the schemas directory, and
 * writes them adjacent to the relevant schema file as a `.ts` file.
 *
 * Can be run as a CI check with the `--check-only` flag, which will not write
 * to disk, but instead check that all types files are in sync with what the
 * generator produces. If it fails, the script will print the names of files
 * that are out of sync, and exit with a non-zero code.
 */
async function generateTypes() {
  const args = process.argv.slice(2);
  const checkOnly = args[0] && (args[0] === '--check-only' || args[0] === '-c');

  if (checkOnly) {
    console.info(`\nChecking generated type definitions are up to date...`);
  } else {
    console.info(`\nGenerating type definitions from schemas...`);
  }

  const rootDir = path.join(__dirname, '..');
  const schemaDir = path.join(rootDir, 'src', 'schemas');
  const schemaGlob = path.join(schemaDir, '**', '*.json');

  const schemaFilePaths = globby.sync(schemaGlob);
  console.info(
    '\nSchema files found:\n\n' +
      schemaFilePaths
        .map((filePath) => `  ${path.relative(rootDir, filePath)}`)
        .join('\n'),
  );

  const generatedFiles = await Promise.all(
    schemaFilePaths.map(async (schemaFilePath) => {
      let schema = await loadJSON(schemaFilePath);

      // Fastify route schemas are not valid JSON schema, so we work around this
      // by coercing any JSON with a 'response' field into a usable shape.
      if (schema.response) {
        const reducedSchema = omit(schema, excludeFields);
        schema = {
          type: 'object' as const,
          properties: reducedSchema,
          required: Object.keys(reducedSchema),
          additionalProperties: false,
        };
      }

      const typeFileName = path.basename(
        schemaFilePath,
        path.extname(schemaFilePath),
      );
      const bannerComment = generateBannerComment(
        path.relative(rootDir, schemaFilePath),
      );
      const style = await loadJSON(
        path.join(__dirname, '..', '.prettierrc.json'),
      );
      const typedef = await compile(schema, typeFileName, {
        bannerComment,
        style,
        cwd: schemaDir,
        enableConstEnums: false,
      });

      const typeDefPath = path.join(
        rootDir,
        'src',
        'types',
        path.relative(schemaDir, path.dirname(schemaFilePath)),
        `${typeFileName}.ts`,
      );

      let isCurrent = false;

      if (checkOnly) {
        const existingTypes = await fsp.readFile(typeDefPath, {
          encoding: 'utf-8',
        });
        isCurrent = existingTypes === typedef;
      } else {
        await fsp.writeFile(typeDefPath, typedef, { encoding: 'utf-8' });
        isCurrent = true;
      }

      return { typeDefPath, isCurrent };
    }),
  );

  if (checkOnly) {
    let hasOutdatedTypes = false;
    console.info(`\nTypes checked:\n`);
    generatedFiles.forEach(({ typeDefPath, isCurrent }) => {
      if (isCurrent) {
        console.info(`  ${green(path.relative(rootDir, typeDefPath))}`);
      } else {
        console.error(`  ${red(path.relative(rootDir, typeDefPath))}`);
        hasOutdatedTypes = true;
      }
    });
    if (hasOutdatedTypes) {
      console.error(
        `\n${red(
          'Types are outdated, please run `./scripts/generate-types.ts`',
        )}\n`,
      );
    }
    process.exit(Number(hasOutdatedTypes));
  } else {
    console.info(`\nTypes generated:\n`);
    generatedFiles.forEach(({ typeDefPath }) => {
      console.info(`  ${path.relative(rootDir, typeDefPath)}`);
    });
    console.info(`\n${green('Types generated successfully!\n')}`);
  }
}

generateTypes().catch((err) =>
  console.error(`\n ${red('Failed to generate types\n')}`, err),
);
