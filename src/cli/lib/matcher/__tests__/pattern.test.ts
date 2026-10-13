import { describe, expect, it } from 'vitest';

import { Pattern } from '../index.js';

describe('pattern', () => {
  it('should parse a string literal to a pattern', () => {
    const pattern = Pattern.create('**/*.ts');
    expect(pattern.source).toBe('**/*.ts');
    expect(pattern.segments).toEqual([
      { kind: 'globstar' },
      { kind: 'star' },
      { kind: 'literal', value: '.ts' },
    ]);
  });
});
