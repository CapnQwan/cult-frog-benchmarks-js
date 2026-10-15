import { describe, expect, it } from 'vitest';

import { benchmark } from '../bench/benchmark.js';

describe('sandbox', () => {
  describe('bench', () => {
    const samples = 10;
    let i = 0;

    const fn = () => {
      i = i + 1;
    };

    it('should record a given number of samples', () => {
      const result = benchmark(fn, { samples, warmupTime: 0 });
      expect(result.count).toEqual(samples);
      expect(i).toBeGreaterThanOrEqual(samples * result.iterations);
    });
  });
});
