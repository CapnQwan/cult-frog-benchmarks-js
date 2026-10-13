export const star = { kind: 'star' } as const;
export const question = { kind: 'question' } as const;

export function literal(value: string): { readonly kind: 'literal'; readonly value: string } {
  return { kind: 'literal', value };
}
