import type { BenchmarkConfig } from './_types/config.js';

export const DEFAULT_CONFIG: BenchmarkConfig = {
  include: ['**/*.bench.ts', '**/*.bench.js'],
  exclude: ['node_modules/**', 'dist/**'],
  output: './benchmarks',
};
