import { benchmark } from '../bench/benchmark.js';
import * as context from './context.js';

import type { BenchResult } from './_types/benchResult.js';

export function execute(selectGroups: string[] = []): BenchResult[] {
  const ctx = context.get();

  for (const registered of ctx.registered) {
    const groups = registered.group.split(' › ');
    if (selectGroups.length > 0 && !groups.some((group) => selectGroups.includes(group))) continue;
    const summary = benchmark(registered.name, registered.fn, registered.options);
    context.registerResult(registered, summary);
  }

  return ctx.results;
}
