/** biome-ignore-all lint/suspicious/noConsole: CLI Tool logs details for debugging */
import { readFileSync } from 'node:fs';

import { DEFAULT_CONFIG } from './default.js';
import { isValidConfig } from './validation.js';

import type { BenchmarkConfig } from './_types/config.js';

export function loadBenchmarkConfig(path: string): BenchmarkConfig {
  let config: Record<string, unknown>;

  try {
    config = JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    console.warn(`Failed to load benchmark config: ${error}`);
    console.warn('Using default config');
    return DEFAULT_CONFIG;
  }

  console.log('config', config);

  return parseBenchmarkConfig(config);
}

export function parseBenchmarkConfig(config: Record<string, unknown>): BenchmarkConfig {
  if (!isValidConfig(config)) throw new Error('Invalid config');
  return { ...DEFAULT_CONFIG, ...config };
}
