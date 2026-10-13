import type { Part } from './_types/parts.js';

export const globstar = { kind: 'globstar' } as const;

export function parts(parts: Part[]): { readonly kind: 'parts'; readonly parts: readonly Part[] } {
  return { kind: 'parts', parts };
}
