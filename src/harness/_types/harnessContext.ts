import type { BenchCase } from './benchCase.js';
import type { BenchResult } from './benchResult.js';

export interface HarnessContext {
  registered: BenchCase[];
  groupStack: string[];
  results: BenchResult[];
}
