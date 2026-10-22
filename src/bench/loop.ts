import { blackhole } from './sink.js';

/** Calls `fn` `iterations` times, passing each result to `blackhole`. */
export type Loop = (fn: () => unknown, iterations: number) => void;

let nextLoopId = 0;

/**
 * Compiles a new loop for one benchmark, so the `fn()` call inside it only ever sees that one
 * function and V8 can inline it.
 *
 * The `// loop ${id}` comment makes each loop's source unique. V8 caches compiled code by
 * source text, so without it every benchmark would get the same cached loop back, share its
 * `fn()` call site, and later benchmarks would stop being inlined. Please don't remove it)
 */
export function createLoop(): Loop {
  const id = nextLoopId++;
  const factory = new Function(
    'blackhole',
    `return function loop(fn, iterations) {
      for (let i = 0; i < iterations; i++) blackhole(fn());
    } // loop ${id}`
  ) as (sink: typeof blackhole) => Loop;
  return factory(blackhole);
}
