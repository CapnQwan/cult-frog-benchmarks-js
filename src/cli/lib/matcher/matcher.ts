import * as Pattern from './pattern.js';

import type { Matcher } from './_types/matcher.js';

function parsePattern(pattern: string): RegExp {
  return new RegExp(pattern);
}

export function create(pattern: string): Matcher {
  return {
    regex: parsePattern(pattern),
    pattern: Pattern.create(pattern),
    isMatch(path) {
      return this.regex.test(path);
    },
  };
}
