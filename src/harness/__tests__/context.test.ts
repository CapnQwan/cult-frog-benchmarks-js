import * as vitest from 'vitest';

import { bench } from '../bench.js';
import * as context from '../context.js';
import { describe } from '../describe.js';

const TEST_FN = () => {};

vitest.describe('takeRegistered', () => {
  vitest.it('should return every registered benchmark and clear the registry', () => {
    describe('group', () => {
      bench('a', TEST_FN);
      bench('b', TEST_FN);
    });

    const taken = context.takeRegistered();
    vitest.expect(taken.map((registered) => registered.name)).toEqual(['a', 'b']);
    vitest.expect(context.get().registered).toHaveLength(0);
  });

  vitest.it('should only return benchmarks registered since the last call', () => {
    describe('first file', () => bench('a', TEST_FN));
    context.takeRegistered();

    describe('second file', () => bench('b', TEST_FN));
    vitest.expect(context.takeRegistered().map((registered) => registered.name)).toEqual(['b']);
  });
});
