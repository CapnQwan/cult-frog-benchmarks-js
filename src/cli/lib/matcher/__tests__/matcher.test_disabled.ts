import { describe, expect, it } from 'vitest';

import { Matcher } from '../index.js';

const SRC_REGEX = /^src\/(?:[^/]+\/)*[^/]*\.bench\.ts$/;
const EXAMPLES_REGEX = /^examples\/(?:[^/]+\/)*[^/]*\.bench\.ts$/;

describe('matcher', () => {
  it('should parse a string literal to a regex', () => {
    const matcher1 = Matcher.create('src/**/*.bench.ts');
    const matcher2 = Matcher.create('examples/**/*.bench.ts');

    expect(matcher1.regex).toBe(SRC_REGEX);
    expect(matcher2.regex).toBe(EXAMPLES_REGEX);
  });

  it('should match a pattern', () => {
    const matcher = Matcher.create('**/*.ts');
    expect(matcher.isMatch('src/index.ts')).toBe(true);
  });
});
