#!/usr/bin/env node

// 0: Parse the command line arguments
// something like: -s '' is the path to save to? otherwise it will just print to the console

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { Args } from './lib/args/index.js';

const cwd = process.cwd();
const argsObj = Args.parse();

// 1: Load config files

const config = JSON.parse(readFileSync(resolve(cwd, 'cfbench.json'), 'utf8'));
const includes: string[] | undefined = config.include;
const excludes: string[] | undefined = config.exclude;
// biome-ignore lint/suspicious/noConsole: debugging
console.log('config', config);

// 2: Using the config file denoting the naming convention for the benchmarks fetch all of the files in the project that match the naming convention

const files = [];

for (const file of readdirSync(cwd, { recursive: true, withFileTypes: true })) {
  if (file.isDirectory()) continue;
  const fullPath = resolve(file.parentPath, file.name);
  if (includes && !includes.includes(fullPath)) continue;
  if (excludes?.includes(fullPath)) continue;
  console.log('file', file.name);
  files.push(fullPath);
}

// biome-ignore lint/suspicious/noConsole: debugging
console.log('files', files);

// 3: Execute the benchmarks

const results = {};

// 4: Output the results

const saveArgs = argsObj['-s'] || argsObj['--save'];
if (saveArgs) {
  const date = new Date().toISOString();
  const fileName = `${date.replace(/[:.]/g, '-')}.json`;
  if (saveArgs.length === 0) saveArgs?.push(`${cwd}/.benchmarks`);
  const path = saveArgs.join(' ');
  writeFileSync(resolve(path, fileName), JSON.stringify(results, null, 2));
}
