import type { BenchCase } from './benchCase.js';

export interface HarnessContext {
  registered: BenchCase[];
  groupStack: string[];
}
