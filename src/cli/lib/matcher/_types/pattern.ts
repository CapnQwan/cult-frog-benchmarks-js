import type { Segment } from './segments.js';

export interface Pattern {
  readonly source: string;
  readonly segments: readonly Segment[];
}
