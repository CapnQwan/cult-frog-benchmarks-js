import { format } from './format.js';

import type { BenchResult } from './_types/benchResult.js';

export function write(results: BenchResult[]): void {
  const _output = format(results);
  // write to file @ todo
}
