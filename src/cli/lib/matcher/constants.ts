import * as Parts from './parts.js';
import * as Segments from './segments.js';

const GLOBSTAR = '**';
const STAR = '*';
const QUESTION = '?';

export const LITERAL_SEGMENT_MAP = {
  [GLOBSTAR]: Segments.globstar,
} as const;

export const LITERAL_PART_MAP = {
  [STAR]: Parts.star,
  [QUESTION]: Parts.question,
} as const;
