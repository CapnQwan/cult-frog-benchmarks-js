import { benchmark } from '../bench/benchmark.js';
import * as context from './context.js';

import type { BenchResult } from './_types/benchResult.js';

/** Runs the registered benchmarks. Each call runs them again and returns a new array of results. */
export function execute(selectGroups: string[] = []): BenchResult[] {
  const results: BenchResult[] = [];

  for (const registered of context.get().registered) {
    const groups = registered.group.split(' › ');
    if (selectGroups.length > 0 && !groups.some((group) => selectGroups.includes(group))) continue;
    const summary = benchmark(registered.fn, registered.options);
    results.push({ name: registered.name, group: registered.group, summary });
  }

  return results;
}
