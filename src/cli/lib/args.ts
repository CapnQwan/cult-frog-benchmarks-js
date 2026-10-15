import { parseArgs } from 'node:util';

import type { BenchmarkOptions } from '../_types/args.js';

export function benchmarkCliArgs(argv: string[] = process.argv.slice(2)): BenchmarkOptions {
  const args = parseArgs({
    args: argv,
    allowPositionals: false,
    options: {
      baseline: { type: 'boolean', short: 'b' },
      output: { type: 'string', short: 'o' },
    },
    strict: true,
  });

  return {
    baseline: args.values.baseline ?? false,
    output: args.values.output ?? undefined,
  };
}
