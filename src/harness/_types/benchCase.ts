import type { BenchOptions } from '../../bench/_types/options.js';

export interface BenchCase {
  name: string;
  /** Path of `describe()` groups the case was registered in, outermost first. */
  groups: string[];
  fn: () => unknown;
  options: BenchOptions;
}
