import type { BenchmarkSummary } from '../bench/_types/benchmarkSummary.js';
import type { BenchOptions } from '../bench/_types/options.js';
import type { BenchCase } from './_types/benchCase.js';
import type { HarnessContext } from './_types/harnessContext.js';

const context: HarnessContext = {
  registered: [],
  groupStack: [],
  results: [],
};

export function get(): HarnessContext {
  return context;
}

export function pushGroup(group: string) {
  context.groupStack.push(group);
}

export function popGroup() {
  context.groupStack.pop();
}

export function hasGroup() {
  return context.groupStack.length > 0;
}

export function registerCase(name: string, fn: () => void, options: BenchOptions) {
  const ctx = context;
  ctx.registered.push({ name, group: ctx.groupStack.join(' › '), fn, options });
}

export function registerResult(benchCase: BenchCase, summary: BenchmarkSummary) {
  context.results.push({ name: benchCase.name, group: benchCase.group, summary });
}
