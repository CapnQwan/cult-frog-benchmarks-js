import { describe, expect, it } from 'vitest';

import { Matcher } from '../index.js';

const SRC_REGEX = /^src\/(?:[^/]+\/)*[^/]*\.bench\.ts$/;
const EXAMPLES_REGEX = /^examples\/(?:[^/]+\/)*[^/]*\.bench\.ts$/;

function expectMatches(pattern: string, matches: string[], nonMatches: string[]) {
  const matcher = Matcher.create(pattern);
  for (const path of matches) expect(matcher.isMatch(path), `${pattern} ~ ${path}`).toBe(true);
  for (const path of nonMatches) expect(matcher.isMatch(path), `${pattern} !~ ${path}`).toBe(false);
}

describe('matcher', () => {
  it('should compile a pattern to a regex', () => {
    const matcher1 = Matcher.create('src/**/*.bench.ts');
    const matcher2 = Matcher.create('examples/**/*.bench.ts');

    expect(matcher1.regex.source).toBe(SRC_REGEX.source);
    expect(matcher2.regex.source).toBe(EXAMPLES_REGEX.source);
  });

  it('should match nested files under a globstar', () => {
    expectMatches(
      'src/**/*.bench.ts',
      ['src/a.bench.ts', 'src/x/a.bench.ts', 'src/x/y/a.bench.ts'],
      ['lib/a.bench.ts', 'src/a.bench.tsx', 'src/a.ts', 'a.bench.ts']
    );
  });

  it('should match any depth with a leading globstar', () => {
    expectMatches('**/*.ts', ['a.ts', 'src/index.ts', 'a/b/c.ts'], ['a.tsx', 'src/a.js']);
  });

  it('should match everything below a trailing globstar', () => {
    expectMatches('src/**', ['src/a.ts', 'src/x/y/z'], ['lib/a.ts', 'src']);
    expectMatches('**', ['a', 'a/b/c'], []);
  });

  it('should not let star cross directories', () => {
    expectMatches('*.ts', ['a.ts', '.ts'], ['dir/a.ts']);
  });

  it('should match exactly one character with question', () => {
    expectMatches('a?c', ['abc', 'a-c'], ['ac', 'abbc', 'a/c']);
  });

  it('should treat regex characters as literals', () => {
    expectMatches('a+(b).ts', ['a+(b).ts'], ['aa(b).ts', 'ab.ts']);
  });

  it('should normalise patterns and Windows paths', () => {
    expectMatches('./src//**/*.ts/', ['src/a.ts'], []);
    expectMatches('src\\**\\*.ts', ['src\\x\\a.ts', 'src/x/a.ts'], []);
  });

  it('should work when isMatch is passed as a callback', () => {
    const { isMatch } = Matcher.create('*.ts');
    expect(['a.ts', 'b.js'].filter(isMatch)).toEqual(['a.ts']);
  });
});
