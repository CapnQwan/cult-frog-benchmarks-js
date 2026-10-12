import * as context from './context.js';

/** Describe a group of benchmarks */
export function describe(group: string, fn: () => void): void {
  context.pushGroup(group);
  try {
    fn();
  } finally {
    context.popGroup();
  }
}
