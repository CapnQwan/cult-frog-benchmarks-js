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

export function format(results: BenchResult[]): string {
  let output = '';

  const sorted = results.slice().sort((a, b) => a.group.localeCompare(b.group));
  let currentGroup = '';

  for (const { name, group, summary } of sorted) {
    if (group !== currentGroup) {
      currentGroup = group;
      output += `\n${currentGroup}\n${''.padEnd(46)}      mean       p50       p99   samples       rme`;
    }
    output += `\n  ${name.padEnd(44)}${duration(summary.mean)}${duration(summary.p50)}${duration(summary.p99)}${count(summary.count)}${percent(summary.rme)}`;
  }

  return output;
}
