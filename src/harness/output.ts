import { format } from './format.js';

import type { BenchResult } from './_types/benchResult.js';

export function output(results: BenchResult[]): void {
  // biome-ignore lint/suspicious/noConsole: Output the results to the console
  console.log(format(results));
}
