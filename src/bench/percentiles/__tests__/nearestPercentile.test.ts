import { describe, expect, it } from 'vitest';

import { nearestPercentile } from '../nearestPercentile.js';

describe('percentiles', () => {
  describe('nearestPercentile', () => {
    it('should return the nearest percentile of a sorted float 64 array', () => {
      const items = new Float64Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      const p25 = nearestPercentile(items, 25);
      const p50 = nearestPercentile(items, 50);
      const p75 = nearestPercentile(items, 75);
      const p90 = nearestPercentile(items, 90);
      const p95 = nearestPercentile(items, 95);
      const p99 = nearestPercentile(items, 99);

      expect(p25).toEqual(3);
      expect(p50).toEqual(5);
      expect(p75).toEqual(8);
      expect(p90).toEqual(9);
      expect(p95).toEqual(10);
      expect(p99).toEqual(10);
    });

    it('Should do something sensible when the array is empty', () => {
      const items = new Float64Array(0);

      const p25 = nearestPercentile(items, 25);
      const p50 = nearestPercentile(items, 50);
      const p75 = nearestPercentile(items, 75);

      expect(p25).toBeUndefined();
      expect(p50).toBeUndefined();
      expect(p75).toBeUndefined();
    });
  });
});
