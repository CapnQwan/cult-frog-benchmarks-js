export interface BenchOptions {
  /** How long the benchmark should run in milliseconds. */
  time?: number;
  minSamples?: number;
  warmupTime?: number;
  samples?: number;
}
