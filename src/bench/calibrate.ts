import type { Loop } from './loop.js';

const TARGET_SAMPLE_MS = 1;

/** Number of calls per sample needed for one sample to take at least `TARGET_SAMPLE_MS`. */
export function calibrate(loop: Loop, fn: () => unknown): number {
  let iterations = 1;
  for (;;) {
    const start = performance.now();
    loop(fn, iterations);
    if (performance.now() - start >= TARGET_SAMPLE_MS) return iterations;
    iterations *= 2;
  }
}
