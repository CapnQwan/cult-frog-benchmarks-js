import type { BenchmarkSummary } from '../../bench/_types/benchmarkSummary.js';

export interface BenchResult {
  name: string;
  group: string;
  summary: BenchmarkSummary;
}
