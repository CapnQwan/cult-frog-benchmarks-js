import { describe, expect, it } from 'vitest';

import { benchmark } from '../bench/benchmark.js';

describe('sandbox', () => {
  describe('bench', () => {
    const samples = 10;
    let i = 0;

    const fn = () => {
      i = i + 1;
    };

    it('should run a function a given number of times', () => {
      const result = benchmark('test', fn, { samples });
      expect(i).toEqual(samples);
    });
  });
});
