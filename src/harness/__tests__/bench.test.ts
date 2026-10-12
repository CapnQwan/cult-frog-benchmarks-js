import * as vitest from 'vitest';

import { bench } from '../bench.js';
import * as context from '../context.js';
import { describe } from '../describe.js';

const TEST_GROUND = 'test group';

const TEST_NAME = 'test';
const TEST_FN = () => {};
const TEST_OPTIONS = { samples: 1000, warmupSamples: 1000 };

vitest.describe('bench', () => {
  const ctx = context.get();

  vitest.it('should register a benchmark', () => {
    describe(TEST_GROUND, () => {
      bench(TEST_NAME, TEST_FN, TEST_OPTIONS);
    });

    vitest.expect(ctx.registered).toHaveLength(1);
    const registered = ctx.registered[0];
    vitest.expect(registered).toBeDefined();
    vitest.expect(registered?.name).toBe(TEST_NAME);
    vitest.expect(registered?.fn).toBe(TEST_FN);
    vitest.expect(registered?.options).toBe(TEST_OPTIONS);
  });

  vitest.it('should throw an error if not inside a describe', () => {
    vitest
      .expect(() => bench(TEST_NAME, TEST_FN, TEST_OPTIONS))
      .toThrow('bench("test") must be inside describe()');
  });
});
