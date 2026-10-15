import { blackhole } from './sink.js';

const TARGET_SAMPLE_MS = 1;

/** Number of calls per sample needed for one sample to take at least `TARGET_SAMPLE_MS`. */
export function calibrate(fn: () => unknown): number {
  let iterations = 1;
  for (;;) {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) blackhole(fn());
    if (performance.now() - start >= TARGET_SAMPLE_MS) return iterations;
    iterations *= 2;
  }
}
