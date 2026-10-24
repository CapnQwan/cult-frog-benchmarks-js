import { parseArgs } from 'node:util';

import type { BenchmarkOptions } from '../_types/args.js';

/** @throws If `argv` has an unknown flag, a positional argument, or `--output` without a value. */
export function benchmarkCliArgs(argv: string[] = process.argv.slice(2)): BenchmarkOptions {
  const args = parseArgs({
    args: argv,
    allowPositionals: false,
    options: {
      save: { type: 'boolean', short: 's' },
      output: { type: 'string', short: 'o' },
    },
    strict: true,
  });

  return {
    save: args.values.save ?? false,
    output: args.values.output ?? undefined,
  };
}
