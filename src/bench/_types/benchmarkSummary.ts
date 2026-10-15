export interface BenchmarkSummary {
  /** Number of samples recorded. */
  count: number;
  /** Number of calls to the benchmarked function per sample. */
  iterations: number;
  total: number;
  min: number;
  max: number;
  mean: number;
  /** Sample standard deviation. */
  sd: number;
  /** Relative margin of error at 95% confidence, as a percentage of the mean. */
  rme: number;
  p50: number;
  p90: number;
  p95: number;
  p99: number;
}
