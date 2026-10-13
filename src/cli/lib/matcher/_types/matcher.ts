import type { Pattern } from './pattern.js';

export interface Matcher {
  readonly regex: RegExp;
  readonly pattern: Pattern;
  readonly isMatch: (path: string) => boolean;
}
