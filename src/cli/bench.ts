#!/usr/bin/env node
/** biome-ignore-all lint/suspicious/noConsole: CLI output goes to the console */

import { readdirSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { context, output, runCases } from '../harness/index.js';
import { CONFIG_FILE_NAME } from './lib/config/constants.js';
import { loadBenchmarkConfig, Matcher } from './lib/index.js';

import type { BenchResult } from '../harness/_types/benchResult.js';

const cwd = process.cwd();

// 1: Load the config

const { include, exclude } = loadBenchmarkConfig(resolve(cwd, CONFIG_FILE_NAME));

// 2: Find the bench files that match the config's patterns

const includes = include.map((pattern) => Matcher.create(pattern));
const excludes = exclude.map((pattern) => Matcher.create(pattern));

const files: string[] = [];

for (const file of readdirSync(cwd, { recursive: true, withFileTypes: true })) {
  if (file.isDirectory()) continue;
  const fullPath = resolve(file.parentPath, file.name);
  // Patterns are written relative to the project root, so match against the relative path
  const relativePath = relative(cwd, fullPath);
  if (!includes.some((matcher) => matcher.isMatch(relativePath))) continue;
  if (excludes.some((matcher) => matcher.isMatch(relativePath))) continue;
  files.push(fullPath);
}

if (files.length === 0) console.warn(`No bench files matched ${include.join(', ')}`);

// 3: Import each file and run the benchmarks it registered

const fileResults: { file: string; results: BenchResult[] }[] = [];

for (const fullPath of files) {
  const file = relative(cwd, fullPath);

  try {
    // import() takes a URL, and a Windows path like C:\a.bench.ts is not a valid one
    // biome-ignore lint/performance/noAwaitInLoops: files must load one at a time so each file's benchmarks can be taken before the next registers
    await import(pathToFileURL(fullPath).href);
  } catch (error) {
    reportLoadError(file, error);
    // A file that fails partway through may have registered some benchmarks already
    context.takeRegistered();
    process.exitCode = 1;
    continue;
  }

  // Bench files register on import and are only imported once, so take this file's
  // benchmarks now, before the next file's are mixed in
  const results = runCases(context.takeRegistered());
  fileResults.push({ file, results });

  console.log(`\n${file}`);
  output(results);
}

// 4: Save the results
// TODO: write `fileResults` to `--output` or the config's `output`

function reportLoadError(file: string, error: unknown): void {
  if ((error as NodeJS.ErrnoException).code === 'ERR_UNKNOWN_FILE_EXTENSION') {
    console.error(
      `Failed to load ${file}: running .ts bench files needs Node 22.18 or newer (this is ${process.version})`
    );
    return;
  }
  console.error(`Failed to load ${file}:`, error);
}
