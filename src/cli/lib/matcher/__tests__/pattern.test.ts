import { describe, expect, it } from 'vitest';

import { Pattern } from '../index.js';

describe('pattern', () => {
  it('should parse a string literal to a pattern', () => {
    const pattern = Pattern.create('**/*.ts');
    expect(pattern.source).toBe('**/*.ts');
    expect(pattern.segments).toEqual([
      { kind: 'globstar' },
      { kind: 'parts', parts: [{ kind: 'star' }, { kind: 'literal', value: '.ts' }] },
    ]);
  });

  it('should split literals around wildcards', () => {
    expect(Pattern.create('a*b?c').segments).toEqual([
      {
        kind: 'parts',
        parts: [
          { kind: 'literal', value: 'a' },
          { kind: 'star' },
          { kind: 'literal', value: 'b' },
          { kind: 'question' },
          { kind: 'literal', value: 'c' },
        ],
      },
    ]);
  });

  it('should treat ** inside a segment as a single star', () => {
    expect(Pattern.create('a**b').segments).toEqual([
      {
        kind: 'parts',
        parts: [{ kind: 'literal', value: 'a' }, { kind: 'star' }, { kind: 'literal', value: 'b' }],
      },
    ]);
  });

  it('should collapse consecutive globstars', () => {
    expect(Pattern.create('**/**/a').segments).toEqual([
      { kind: 'globstar' },
      { kind: 'parts', parts: [{ kind: 'literal', value: 'a' }] },
    ]);
  });

  it('should keep the original source but normalise the segments', () => {
    const pattern = Pattern.create('./src//a/');
    expect(pattern.source).toBe('./src//a/');
    expect(pattern.segments).toEqual([
      { kind: 'parts', parts: [{ kind: 'literal', value: 'src' }] },
      { kind: 'parts', parts: [{ kind: 'literal', value: 'a' }] },
    ]);
  });
});
