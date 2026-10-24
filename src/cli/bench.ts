#!/usr/bin/env node
/** biome-ignore-all lint/suspicious/noConsole: CLI output goes to the console */

import { posix, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

import { context, createReport, output, runCases, write } from '../harness/index.js';
import { CONFIG_FILE_NAME } from './lib/config/constants.js';
import { benchmarkCliArgs, findFiles, loadBenchmarkConfig, Matcher } from './lib/index.js';

import type { BenchFileResult } from '../harness/_types/benchReport.js';
import type { BenchmarkOptions } from './_types/args.js';

const cwd = process.cwd();

// 1: Parse the arguments and load the config

let args: BenchmarkOptions;
try {
  args = benchmarkCliArgs();
} catch (error) {
  console.error((error as Error).message);
  process.exit(1);
}

const config = loadBenchmarkConfig(resolve(cwd, CONFIG_FILE_NAME));
const { include, exclude } = config;

// 2: Find the bench files that match the config's patterns

const includes = include.map((pattern) => Matcher.create(pattern));
const excludes = exclude.map((pattern) => Matcher.create(pattern));

const files = findFiles(cwd, includes, excludes);

if (files.length === 0) console.warn(`No bench files matched ${include.join(', ')}`);

// 3: Import each file and run the benchmarks it registered

const fileResults: BenchFileResult[] = [];

for (const fullPath of files) {
  // Always `/`-separated, so reports saved on Windows and elsewhere name files the same way
  const file = relative(cwd, fullPath).split(sep).join(posix.sep);

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

// 4: Save the results, if asked to. Files that failed to load are left out, and the exit code
// still reports the failure

if ((args.save || args.output !== undefined) && fileResults.length > 0) {
  const directory = resolve(cwd, args.output ?? config.output);
  const path = write(directory, createReport(fileResults));
  console.log(`\nSaved results to ${relative(cwd, path)}`);
}

function reportLoadError(file: string, error: unknown): void {
  if ((error as NodeJS.ErrnoException).code === 'ERR_UNKNOWN_FILE_EXTENSION') {
    console.error(
      `Failed to load ${file}: running .ts bench files needs Node 22.18 or newer (this is ${process.version})`
    );
    return;
  }
  console.error(`Failed to load ${file}:`, error);
}
