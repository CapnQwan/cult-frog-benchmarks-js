import * as vitest from 'vitest';

import { bench } from '../bench.js';
import { describe } from '../describe.js';
import { execute } from '../execute.js';

const TEST_OPTIONS = { samples: 2, warmupTime: 0 };

describe('outer', () => {
  bench('a', () => 1, TEST_OPTIONS);
  describe('inner', () => {
    bench('b', () => 2, TEST_OPTIONS);
  });
});

describe('other', () => {
  bench('c', () => 3, TEST_OPTIONS);
});

vitest.describe('execute', () => {
  vitest.it('should run every registered benchmark', () => {
    const results = execute();
    vitest.expect(results.map((result) => result.name)).toEqual(['a', 'b', 'c']);
    vitest.expect(results[1]?.groups).toEqual(['outer', 'inner']);
  });

  vitest.it('should only run benchmarks in a selected group or its subgroups', () => {
    vitest.expect(execute(['outer']).map((result) => result.name)).toEqual(['a', 'b']);
    vitest.expect(execute(['inner']).map((result) => result.name)).toEqual(['b']);
  });

  vitest.it('should return new results on every call', () => {
    const first = execute();
    const second = execute();
    vitest.expect(second).not.toBe(first);
    vitest.expect(second).toHaveLength(3);
  });
});
