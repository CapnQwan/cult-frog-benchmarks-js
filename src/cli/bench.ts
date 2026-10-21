#!/usr/bin/env node

// 0: Parse the command line arguments
// something like: -s '' is the path to save to? otherwise it will just print to the console

import { readdirSync } from 'node:fs';
import { relative, resolve } from 'node:path';

import { CONFIG_FILE_NAME } from './lib/config/constants.js';
import { loadBenchmarkConfig, Matcher } from './lib/index.js';

const cwd = process.cwd();

// 1: Load config files

const { include, exclude } = loadBenchmarkConfig(resolve(cwd, CONFIG_FILE_NAME));

// 2: Using the config file denoting the naming convention for the benchmarks fetch all of the files in the project that match the naming convention

const includes = include.map((pattern) => Matcher.create(pattern));
const excludes = exclude.map((pattern) => Matcher.create(pattern));

const files = [];

for (const file of readdirSync(cwd, { recursive: true, withFileTypes: true })) {
  if (file.isDirectory()) continue;
  const fullPath = resolve(file.parentPath, file.name);
  // Patterns are written relative to the project root, so match against the relative path
  const relativePath = relative(cwd, fullPath);
  if (!includes.some((matcher) => matcher.isMatch(relativePath))) continue;
  if (excludes.some((matcher) => matcher.isMatch(relativePath))) continue;
  files.push(fullPath);
}

// biome-ignore lint/suspicious/noConsole: debugging
console.log('files', files);

// 3: Execute the benchmarks

const _results = {};

// 4: Output the results

// const saveArgs = argsObj['-s'] || argsObj['--save'];
// if (saveArgs) {
//   const date = new Date().toISOString();
//   const fileName = `${date.replace(/[:.]/g, '-')}.json`;
//   if (saveArgs.length === 0) saveArgs?.push(`${cwd}/.benchmarks`);
//   const path = saveArgs.join(' ');
//   writeFileSync(resolve(path, fileName), JSON.stringify(results, null, 2));
// }
