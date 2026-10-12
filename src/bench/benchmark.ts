import { BenchmarkRecorder } from './recorders/benchmarkRecorder.js';
import { validateNonNegativeInt } from './validation/isNonNegativeInt.js';
import { validatePositiveInt } from './validation/isPositiveInt.js';

import type { BenchmarkSummary } from './_types/benchmarkSummary.js';
import type { BenchOptions } from './_types/options.js';

const DEFAULT_SAMPLES = 1;
const DEFAULT_MIN_WARMUP_SAMPLES_COUNT = 0;

export function benchmark(
  name: string,
  fn: () => void,
  options: BenchOptions = {}
): BenchmarkSummary {
  const samples = options.samples ?? DEFAULT_SAMPLES;
  const minWarmupSamplesCount = options.warmupSamples ?? DEFAULT_MIN_WARMUP_SAMPLES_COUNT;

  validatePositiveInt('samples', samples);
  validateNonNegativeInt('minWarmupSamplesCount', minWarmupSamplesCount);

  const recorder = new BenchmarkRecorder(samples);

  const start = performance.now();

  let warmupIterations = 0;

  for (;;) {
    if (warmupIterations < minWarmupSamplesCount) {
      fn();
      warmupIterations++;
      continue;
    }

    recorder.start();
    fn();
    recorder.end();

    if (recorder.count >= samples) break;
  }

  return recorder.summarize();
}
