import type { Part } from './parts.js';

export type Segment =
  | { readonly kind: 'globstar' } // ** as a whole segment
  | { readonly kind: 'parts'; readonly parts: readonly Part[] };
