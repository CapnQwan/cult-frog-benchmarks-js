import type { BenchResult } from './benchResult.js';

/** The results of one bench file. */
export interface BenchFileResult {
  /** Path of the bench file, relative to the folder the CLI ran in. */
  file: string;
  results: BenchResult[];
}

/**
 * One saved run. Timings only mean something next to the machine and runtime that produced
 * them, so those are recorded too, for comparing runs later. All timings in `files` are in
 * milliseconds per call, so fast benchmarks show up as very small numbers.
 */
export interface BenchReport {
  /** Format version. Bump it when this shape changes, so older reports can still be read. */
  version: number;
  /** When the run finished, as an ISO 8601 string. */
  date: string;
  node: string;
  platform: string;
  arch: string;
  cpu: string;
  files: BenchFileResult[];
}
