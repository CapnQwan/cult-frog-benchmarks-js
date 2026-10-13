import { LITERAL_PART_MAP } from './constants.js';

import type { Part } from './_types/parts.js';
import type { Pattern } from './_types/pattern.js';
import type { Segment } from './_types/segments.js';

export function create(source: string): Pattern {
  return {
    source,
    segments: createSegments(source),
  };
}

function createSegments(source: string): Segment[] {
  const segments: Segment[] = [];
  const stringSegments = source.trim().split('/');

  for (const part of stringSegments) {
    segments.push(createSegment(part));
  }

  return segments;
}

function createSegment(source: string): Segment {
  switch (source) {
    case '**':
      return { kind: 'globstar' };
    default:
      return { kind: 'parts', parts: createParts(source) };
  }
}

function createParts(source: string): Part[] {
  const parts: Part[] = [];
  let str = `${source}`;

  let length = 1;
  let current = str.slice(0, length);

  while (str.length > 0) {
    const part = getPart(str);

    if (part) {
      parts.push(part);
      str = str.slice(current.length);
      length = 1;
      current = str.slice(0, length);
      continue;
    }

    length++;
    current = str.slice(0, length);
    if (length > str.length) throw new Error(`Invalid pattern: ${source}`);
  }

  return parts;
}

function getPart(str: string): Part | undefined {
  if (!Object.hasOwn(LITERAL_PART_MAP, str)) return undefined;
  return LITERAL_PART_MAP[str as keyof typeof LITERAL_PART_MAP];
}
