import type { BenchOptions } from '../../bench/_types/options.js';

export interface BenchCase {
  name: string;
  group: string;
  fn: () => unknown;
  options: BenchOptions;
}
