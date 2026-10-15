import { describe, expect, it } from 'vitest';

import { benchmark } from '../benchmark.js';

const FAST_FN = () => 1 + 1;

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

  it('should reject invalid options', () => {
    expect(() => benchmark(FAST_FN, { samples: 0 })).toThrow();
    expect(() => benchmark(FAST_FN, { time: 0 })).toThrow();
    expect(() => benchmark(FAST_FN, { minSamples: 0 })).toThrow();
    expect(() => benchmark(FAST_FN, { warmupTime: -1 })).toThrow();
  });
});
