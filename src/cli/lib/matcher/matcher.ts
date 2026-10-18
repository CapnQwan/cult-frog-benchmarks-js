import { parse } from './parse.js';
import * as Pattern from './pattern.js';

import type { Matcher } from './_types/matcher.js';

export function create(source: string): Matcher {
  const pattern = Pattern.create(source);
  const regex = parse(pattern);

  return {
    regex,
    pattern,
    isMatch: (path) => regex.test(path.replace(/\\/g, '/')),
  };
}
