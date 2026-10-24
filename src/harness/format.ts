import type { BenchResult } from './_types/benchResult.js';

/**
 * Formats a duration given in milliseconds, picking ns, µs or ms so fast benchmarks don't round
 * to zero.
 */
export function duration(value: number) {
  if (value < 0.001) return `${(value * 1e6).toFixed(2)} ns`.padStart(10);
  if (value < 1) return `${(value * 1e3).toFixed(2)} µs`.padStart(10);
  return `${value.toFixed(2)} ms`.padStart(10);
}

function count(value: number) {
  return String(value).padStart(10);
}

function percent(value: number) {
  return `±${value.toFixed(2)}%`.padStart(10);
}

/**
 * Groups results under one heading per group, in the order each group first appears, so the
 * output follows the order the benchmarks were declared in.
 */
export function format(results: BenchResult[]): string {
  const byGroup = new Map<string, BenchResult[]>();
  for (const result of results) {
    const heading = result.groups.join(' › ');
    const group = byGroup.get(heading);
    if (group) group.push(result);
    else byGroup.set(heading, [result]);
  }

  let output = '';

  for (const [heading, group] of byGroup) {
    output += `\n${heading}\n${''.padEnd(46)}      mean       p50       p99   samples       rme`;
    for (const { name, summary } of group) {
      output += `\n  ${name.padEnd(44)}${duration(summary.mean)}${duration(summary.p50)}${duration(summary.p99)}${count(summary.count)}${percent(summary.rme)}`;
    }
  }

  return output;
}
