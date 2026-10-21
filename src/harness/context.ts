import type { BenchOptions } from '../bench/_types/options.js';
import type { HarnessContext } from './_types/harnessContext.js';

const context: HarnessContext = {
  registered: [],
  groupStack: [],
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

export function registerCase(name: string, fn: () => unknown, options: BenchOptions) {
  const ctx = context;
  ctx.registered.push({ name, group: ctx.groupStack.join(' › '), fn, options });
}
