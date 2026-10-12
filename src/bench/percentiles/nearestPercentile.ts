/**
 * Nearest percentile of an ascending, non-empty array: the value at rank
 * `ceil(percentile / 100 × n)`, one-based.
 */
export function nearestPercentile(sorted: Float64Array, percentile: number): number | undefined {
  const rank = Math.ceil((percentile / 100) * sorted.length);
  return sorted[Math.max(rank, 1) - 1];
}
