import { benchmark } from '../bench/benchmark.js';
import * as context from './context.js';

import type { BenchCase } from './_types/benchCase.js';
import type { BenchResult } from './_types/benchResult.js';

/**
 * Runs the given benchmarks, skipping any outside `selectGroups` when it isn't empty. A case is
 * selected when any group in its path matches, so selecting a group includes its subgroups.
 */
export function runCases(cases: readonly BenchCase[], selectGroups: string[] = []): BenchResult[] {
  const results: BenchResult[] = [];

  for (const registered of cases) {
    const groups = registered.group.split(' › ');
    if (selectGroups.length > 0 && !groups.some((group) => selectGroups.includes(group))) continue;
    const summary = benchmark(registered.fn, registered.options);
    results.push({ name: registered.name, group: registered.group, summary });
  }

  return results;
}

/**
 * Runs the registered benchmarks without clearing them, for scripts that register and run in one
 * go. Each call runs them again and returns a new array of results.
 */
export function execute(selectGroups: string[] = []): BenchResult[] {
  return runCases(context.get().registered, selectGroups);
}
