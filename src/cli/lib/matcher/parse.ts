import type { Part } from './_types/parts.js';
import type { Pattern } from './_types/pattern.js';

/** Any number of directories, each followed by its `/`. Matches zero directories too. */
const GLOBSTAR_DIRECTORIES = '(?:[^/]+/)*';
/** Everything below the current directory, when `**` is the final segment. */
const GLOBSTAR_REST = '.*';
const STAR = '[^/]*';
const QUESTION = '[^/]';

/** Compiles a pattern to an anchored regex that matches `/`-separated relative paths. */
export function parse(pattern: Pattern): RegExp {
  const { segments } = pattern;
  let source = '';

  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1;

    if (segment.kind === 'globstar') {
      // GLOBSTAR_DIRECTORIES already consumes the `/` before the next segment
      source += isLast ? GLOBSTAR_REST : GLOBSTAR_DIRECTORIES;
      return;
    }

    source += segment.parts.map(compilePart).join('');
    if (!isLast) source += '/';
  });

  return new RegExp(`^${source}$`);
}

function compilePart(part: Part): string {
  switch (part.kind) {
    case 'literal':
      return escapeRegex(part.value);
    case 'star':
      return STAR;
    case 'question':
      return QUESTION;
    default:
      throw new Error(`Unknown pattern part: ${JSON.stringify(part satisfies never)}`);
  }
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
