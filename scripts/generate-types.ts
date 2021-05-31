#!/usr/bin/env -S node -r ts-node/register/transpile-only
/* eslint-disable no-console */

import { promises as fsp, existsSync } from 'fs';
import path from 'path';
import { compile } from 'json-schema-to-typescript';
import globby from 'globby';

// Some colour utilities for the output
export const reset = '\x1b[0m';
const green = (str: string) => `\x1b[32m✓ ${str}${reset}`;
const red = (str: string) => `\x1b[31m${str}${reset}`;

type JsonObj = Record<string, Json>;

type Json =
  | string
  | number
  | boolean
  | null
  | { [property: string]: Json }
  | Json[];

async function loadJSON(path: string) {
  const fileStr = await fsp.readFile(path, { encoding: 'utf-8' });
  return JSON.parse(fileStr) as JsonObj;
}

function generateBannerComment(schemaFilePath: string) {
  const bannerComment = `/* istanbul ignore file */
  /* eslint-disable @typescript-eslint/no-empty-interface,@typescript-eslint/ban-types */

  // DO NOT MANUALLY EDIT THIS FILE
  //
  // To update it:
  // 1) Edit '${schemaFilePath}'
  // 2) Run './scripts/generate-types.ts'`;

  return bannerComment;
}

async function writeFile(path: string, contents: string) {
  await fsp.writeFile(path, contents, { encoding: 'utf-8' });
}

async function isFileCurrent(path: string, newContents: string): Promise<boolean> {
  if (!existsSync(path)) {
    return false;
  }

  const existingContents = await fsp.readFile(path, { encoding: 'utf-8' });

  return newContents === existingContents;
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

  const filesToWrite: { contents: string; filePath: string }[] = [];

  await Promise.all(
    schemaFilePaths.map(async (schemaFilePath) => {
      const typeDir = path.join(
        rootDir,
        'src',
        'types',
        path.relative(schemaDir, path.dirname(schemaFilePath)),
      );
      const typeFileName = path.basename(
        schemaFilePath,
        path.extname(schemaFilePath),
      );
      const bannerComment = generateBannerComment(
        path.relative(rootDir, schemaFilePath),
      );
      const style: Json = await loadJSON(
        path.join(rootDir, '.prettierrc.json'),
      );
      const compileOpts = {
        bannerComment,
        style,
        cwd: schemaDir,
        enableConstEnums: false,
      };

      const schema = await loadJSON(schemaFilePath);

      // Fastify route schemas are not valid JSON schema, so we work around this
      // by coercing any JSON with a 'response' field into a usable shape.
      if (schema.response) {
        const requestSchema = {
          type: 'object' as const,
          properties: {
            body: schema.body ?? {},
            headers: schema.headers ?? {},
            params: schema.params ?? {},
            query: schema.query ?? {},
            reply: { oneOf: Object.values(schema.response) } ?? {},
          },
          required: ['body', 'headers', 'params', 'query', 'reply'],
          additionalProperties: false,
        };

        const requestTypeDef = await compile(
          requestSchema,
          typeFileName,
          compileOpts,
        );
        const requestTypeDefPath = path.join(typeDir, `${typeFileName}.ts`);

        filesToWrite.push({
          filePath: requestTypeDefPath,
          contents: requestTypeDef,
        });
      } else {
        const typeDef = await compile(schema, typeFileName, compileOpts);
        const typeDefPath = path.join(typeDir, `${typeFileName}.ts`);

        filesToWrite.push({ contents: typeDef, filePath: typeDefPath });
      }
    }),
  );

  const currentFiles: string[] = [];
  const newFiles: string[] = [];
  const outdatedFiles: string[] = [];

  await Promise.all(
    filesToWrite.map(async ({ filePath, contents }) => {
      if (await isFileCurrent(filePath, contents)) {
        currentFiles.push(filePath);
      } else {
        if (checkOnly) {
          outdatedFiles.push(filePath);
        } else {
          const dir = path.dirname(filePath);
          if (!existsSync(dir)) {
            await fsp.mkdir(dir);
          }

          await writeFile(filePath, contents);
          newFiles.push(filePath);
        }
      }
    }),
  );

  if (currentFiles.length === filesToWrite.length) {
    console.log(`\n${green('All schema files up to date!')}\n`);
  }

  if (newFiles.length) {
    console.info('\nThe following files were created / updated\n');

    newFiles.forEach((filePath) => {
      console.info(`  ${green(path.relative(rootDir, filePath))}`);
    });

    console.log();
  }

  if (outdatedFiles.length) {
    console.error(
      red(
        '\n⨯ The following type defs are outdated. Please run `./scripts/generate-types.ts`\n',
      ),
    );

    outdatedFiles.forEach((filePath) => {
      console.error(`  ${path.relative(rootDir, filePath)}`);
    });

    console.log();

    process.exit(1);
  }
}

generateTypes().catch((err) =>
  console.error(`\n ${red('Failed to generate types\n')}`, err),
);
