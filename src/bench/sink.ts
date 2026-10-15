// biome-ignore lint/correctness/noUnusedVariables: write-only by design; it exists to defeat dead-code elimination
let sink: unknown;

/**
 * Stores a value somewhere the engine can't prove is unused, so the work that
 * produced it can't be removed as dead code.
 */
export function blackhole(value: unknown): void {
  sink = value;
}
