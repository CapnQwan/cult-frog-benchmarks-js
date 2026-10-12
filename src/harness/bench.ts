import * as context from './context.js';

import type { BenchOptions } from '../bench/_types/options.js';

export function bench(name: string, fn: () => void, options: BenchOptions = {}): void {
  if (!context.hasGroup()) throw new Error(`bench("${name}") must be inside describe()`);
  context.registerCase(name, fn, options);
}
