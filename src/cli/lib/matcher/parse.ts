import type { Pattern } from './_types/pattern.js';

export function parse(pattern: Pattern): RegExp {
  return new RegExp(pattern.source);
}
