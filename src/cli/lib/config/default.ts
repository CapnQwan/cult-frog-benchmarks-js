import type { BenchmarkConfig } from './_types/config.js';

export const DEFAULT_CONFIG: BenchmarkConfig = {
  include: ['**/*.bench.ts', '**/*.bench.js'],
  // Leading `**/` so nested folders are skipped too (workspaces, nested installs), not just the root's
  exclude: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
  // Matches the `.benchmarks/` entry in .gitignore so saved runs aren't committed by accident
  output: './.benchmarks',
};
