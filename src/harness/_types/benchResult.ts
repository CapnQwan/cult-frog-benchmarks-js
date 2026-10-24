import type { BenchmarkSummary } from '../../bench/_types/benchmarkSummary.js';

export interface BenchResult {
  name: string;
  /** Path of `describe()` groups the case was registered in, outermost first. */
  groups: string[];
  summary: BenchmarkSummary;
}
