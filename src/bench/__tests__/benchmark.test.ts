import { describe, expect, it } from 'vitest';

import { benchmark } from '../benchmark.js';

const FAST_FN = () => 1 + 1;
/** Different function bodies, so V8 sees each one as a separate function. */
const OTHER_FNS = [
  () => 2 * 3,
  () => 'a'.length,
  () => [1].length,
  () => Math.max(1, 2),
  () => ({ a: 1 }).a,
];

describe('benchmark', () => {
  it('should record exactly `samples` samples when samples is given', () => {
    const result = benchmark(FAST_FN, { samples: 5, warmupTime: 0 });
    expect(result.count).toEqual(5);
  });

  it('should batch calls to a fast function', () => {
    const result = benchmark(FAST_FN, { samples: 1, warmupTime: 0 });
    expect(result.iterations).toBeGreaterThan(1);
  });

  it('should keep sampling until minSamples is reached', () => {
    const result = benchmark(FAST_FN, { time: 1, minSamples: 50, warmupTime: 0 });
    expect(result.count).toBeGreaterThanOrEqual(50);
  });

  it('should keep sampling until time has elapsed', () => {
    const start = performance.now();
    benchmark(FAST_FN, { time: 20, minSamples: 1, warmupTime: 0 });
    expect(performance.now() - start).toBeGreaterThanOrEqual(20);
  });

  it('should not slow down a benchmark that runs after other benchmarks', () => {
    // Guards the unique id in loop.ts: without it, V8 hands every benchmark the same cached
    // loop, its `fn()` call stops being inlined once a few different functions have gone
    // through it, and benchmarks that run later look several times slower.
    const options = { time: 50, warmupTime: 10 };
    const first = benchmark(FAST_FN, options).mean;
    for (const fn of OTHER_FNS) benchmark(fn, options);
    const after = benchmark(FAST_FN, options).mean;

    // Loose bound so timing noise can't fail it: the bug made `after` around 7x `first`
    expect(after).toBeLessThan(first * 2);
  });

  it('should reject invalid options', () => {
    expect(() => benchmark(FAST_FN, { samples: 0 })).toThrow();
    expect(() => benchmark(FAST_FN, { time: 0 })).toThrow();
    expect(() => benchmark(FAST_FN, { minSamples: 0 })).toThrow();
    expect(() => benchmark(FAST_FN, { warmupTime: -1 })).toThrow();
  });
});
