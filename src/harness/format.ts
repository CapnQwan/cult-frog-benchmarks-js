import type { BenchResult } from './_types/benchResult.js';

function ms(value: number) {
  return value.toFixed(4).padStart(10);
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
    output += `\n  ${name.padEnd(44)}${ms(summary.mean)}${ms(summary.p50)}${ms(summary.p99)}${ms(0)}${ms(0)}`;
  }

  return output;
}
