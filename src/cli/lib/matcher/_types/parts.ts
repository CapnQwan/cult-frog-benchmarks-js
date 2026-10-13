export type Part =
  | { readonly kind: 'literal'; readonly value: string }
  | { readonly kind: 'star' }
  | { readonly kind: 'question' };
