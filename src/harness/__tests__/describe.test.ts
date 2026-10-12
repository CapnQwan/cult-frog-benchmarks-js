import * as vitest from 'vitest';

import * as context from '../context.js';
import { describe } from '../describe.js';

const TEST_NAME = 'test';
const TEST_FN = vitest.vi.fn();

vitest.describe('describe', () => {
  const ctx = context.get();

  vitest.it('Should execute the callback', () => {
    describe(TEST_NAME, TEST_FN);
    vitest.expect(TEST_FN).toHaveBeenCalled();
  });

  vitest.it('should create a new group while executing the callback', () => {
    describe(TEST_NAME, () => {
      const group = ctx.groupStack[0];
      vitest.expect(group).toBeDefined();
      vitest.expect(group).toBe(TEST_NAME);
    });
  });

  vitest.it('should clear the group stack after executing the callback', () => {
    describe(TEST_NAME, () => {
      vitest.expect(ctx.groupStack).toHaveLength(1);
    });
    vitest.expect(ctx.groupStack).toHaveLength(0);
  });
});
