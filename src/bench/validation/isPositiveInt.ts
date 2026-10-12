export function isPositiveInt(value: number): boolean {
  return value > 0 && Number.isInteger(value);
}

export function validatePositiveInt(name: string, value: number): void {
  if (!isPositiveInt(value)) {
    throw new Error(`${name} must be a positive integer`);
  }
}
