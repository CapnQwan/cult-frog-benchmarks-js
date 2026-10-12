export function isNonNegativeInt(value: number): boolean {
  return value >= 0 && Number.isInteger(value);
}

export function validateNonNegativeInt(name: string, value: number): void {
  if (!isNonNegativeInt(value)) {
    throw new Error(`${name} must be a non-negative integer`);
  }
}
