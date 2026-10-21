/** biome-ignore-all lint/suspicious/noConsole: CLI Tool logs details for debugging */
import { readFileSync } from 'node:fs';

import { DEFAULT_CONFIG } from './default.js';
import { isValidConfig } from './validation.js';

import type { BenchmarkConfig } from './_types/config.js';

export function loadBenchmarkConfig(path: string): BenchmarkConfig {
  let source: string;

  try {
    source = readFileSync(path, 'utf8');
  } catch (error) {
    // Only a missing file falls back to the defaults; anything else is a real problem to report
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    console.warn(`No benchmark config found at ${path}, using default config`);
    return DEFAULT_CONFIG;
  }

  let config: unknown;
  try {
    config = JSON.parse(source);
  } catch (error) {
    throw new Error(`Failed to parse benchmark config at ${path}`, { cause: error });
  }

  return parseBenchmarkConfig(config);
}

export function parseBenchmarkConfig(config: unknown): BenchmarkConfig {
  if (!isValidConfig(config)) throw new Error('Invalid config');
  return { ...DEFAULT_CONFIG, ...config };
}
