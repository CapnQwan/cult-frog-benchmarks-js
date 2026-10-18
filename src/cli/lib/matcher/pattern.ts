import * as Parts from './parts.js';
import * as Segments from './segments.js';

import type { Part } from './_types/parts.js';
import type { Pattern } from './_types/pattern.js';
import type { Segment } from './_types/segments.js';

const GLOBSTAR = '**';

const BACKSLASHES = /\\/g;
const LEADING_DOT_SLASH = /^\.\//;
const REPEATED_SLASHES = /\/+/g;
const TRAILING_SLASH = /\/$/;

export function create(source: string): Pattern {
  return {
    source,
    segments: createSegments(normalize(source)),
  };
}

/** Converts separators to `/` and removes a leading `./`, duplicate slashes and a trailing slash. */
export function normalize(source: string): string {
  return source
    .trim()
    .replace(BACKSLASHES, '/')
    .replace(LEADING_DOT_SLASH, '')
    .replace(REPEATED_SLASHES, '/')
    .replace(TRAILING_SLASH, '');
}

function createSegments(source: string): Segment[] {
  const segments: Segment[] = [];

  for (const segment of source.split('/')) {
    // `**/**` is equivalent to `**`
    if (segment === GLOBSTAR && segments.at(-1)?.kind === 'globstar') continue;
    segments.push(createSegment(segment));
  }

  return segments;
}

function createSegment(source: string): Segment {
  if (source === GLOBSTAR) return Segments.globstar;
  return Segments.parts(createParts(source));
}

function createParts(source: string): Part[] {
  const parts: Part[] = [];
  let literal = '';

  const flush = () => {
    if (literal) parts.push(Parts.literal(literal));
    literal = '';
  };

  for (const char of source) {
    if (char === '*') {
      flush();
      // `**` inside a segment behaves like `*`
      if (parts.at(-1)?.kind !== 'star') parts.push(Parts.star);
    } else if (char === '?') {
      flush();
      parts.push(Parts.question);
    } else {
      literal += char;
    }
  }

  flush();
  return parts;
}
