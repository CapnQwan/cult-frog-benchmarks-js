import { calibrate } from './calibrate.js';
import { createLoop } from './loop.js';
import { BenchmarkRecorder } from './recorders/benchmarkRecorder.js';
import { validateNonNegativeInt } from './validation/isNonNegativeInt.js';
import { validatePositiveInt } from './validation/isPositiveInt.js';

import type { BenchmarkSummary } from './_types/benchmarkSummary.js';
import type { BenchOptions } from './_types/options.js';
import type { Loop } from './loop.js';

const DEFAULT_TIME = 1000;
const DEFAULT_MIN_SAMPLES = 30;
const DEFAULT_WARMUP_TIME = 100;

export function benchmark(fn: () => unknown, options: BenchOptions = {}): BenchmarkSummary {
  const time = options.time ?? DEFAULT_TIME;
  const minSamples = options.minSamples ?? DEFAULT_MIN_SAMPLES;
  const warmupTime = options.warmupTime ?? DEFAULT_WARMUP_TIME;
  const samples = options.samples;

  validatePositiveInt('time', time);
  validatePositiveInt('minSamples', minSamples);
  validateNonNegativeInt('warmupTime', warmupTime);
  if (samples !== undefined) validatePositiveInt('samples', samples);

  const loop = createLoop();

  const recorder = new BenchmarkRecorder(samples);

  runWarmup(loop, fn, warmupTime);
  const iterations = calibrate(loop, fn);

  if (samples === undefined) runTime(recorder, loop, fn, time, minSamples, iterations);
  else runSamples(recorder, loop, fn, samples, iterations);

  return { ...recorder.summarize(), iterations };
}

/**
 * Runs `fn` for at least `warmupTime` ms. Batches double in size so fast functions don't
 * spend the warmup reading the clock, at the cost of overshooting by up to 2x.
 */
function runWarmup(loop: Loop, fn: () => unknown, warmupTime: number): void {
  const start = performance.now();
  let batch = 1;
  while (performance.now() - start < warmupTime) {
    loop(fn, batch);
    batch *= 2;
  }
}

function runSamples(
  recorder: BenchmarkRecorder,
  loop: Loop,
  fn: () => unknown,
  samples: number,
  iterations: number
): void {
  for (let s = 0; s < samples; s++) {
    recorder.start();
    loop(fn, iterations);
    recorder.end(iterations);
  }
}

/** Samples until `time` ms have elapsed and at least `minSamples` samples have been recorded. */
function runTime(
  recorder: BenchmarkRecorder,
  loop: Loop,
  fn: () => unknown,
  time: number,
  minSamples: number,
  iterations: number
): void {
  const start = performance.now();
  while (performance.now() - start < time || recorder.count < minSamples) {
    recorder.start();
    loop(fn, iterations);
    recorder.end(iterations);
  }
}
