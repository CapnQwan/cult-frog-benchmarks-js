import { nearestPercentile } from '../percentiles/nearestPercentile.js';
import { tValue95 } from '../statistics/tValue.js';

import type { BenchmarkSummary } from '../_types/benchmarkSummary.js';

const DEFAULT_CAPACITY = 1024;

export class BenchmarkRecorder {
  private _durations: Float64Array;
  private _count = 0;
  private _tickStart = 0;

  constructor(capacity: number = DEFAULT_CAPACITY) {
    this._durations = new Float64Array(Math.max(capacity, 1));
  }

  public get count(): number {
    return this._count;
  }

  public start(): void {
    this._tickStart = performance.now();
  }

  /** Records the time since `start()` as the average duration of `iterations` calls. */
  public end(iterations: number): void {
    const end = performance.now();
    if (this._count === this._durations.length) this.grow();
    this._durations[this._count] = (end - this._tickStart) / iterations;
    this._count++;
  }

  public summarize(): Omit<BenchmarkSummary, 'iterations'> {
    const count = this._count;
    if (count === 0) throw new Error('BenchmarkRecorder.summarize() - no samples recorded');

    const sorted = this._durations.slice(0, count).sort();

    let total = 0;
    for (const duration of sorted) total += duration;
    const mean = total / count;

    let squaredDeviations = 0;
    for (const duration of sorted) squaredDeviations += (duration - mean) ** 2;
    const sd = count > 1 ? Math.sqrt(squaredDeviations / (count - 1)) : 0;

    const standardError = sd / Math.sqrt(count);
    const rme = count > 1 && mean > 0 ? ((tValue95(count - 1) * standardError) / mean) * 100 : 0;

    return {
      count,
      total,
      min: sorted[0] ?? 0,
      max: sorted[count - 1] ?? 0,
      mean,
      sd,
      rme,
      p50: nearestPercentile(sorted, 50) ?? 0,
      p90: nearestPercentile(sorted, 90) ?? 0,
      p95: nearestPercentile(sorted, 95) ?? 0,
      p99: nearestPercentile(sorted, 99) ?? 0,
    };
  }

  private grow(): void {
    const durations = new Float64Array(this._durations.length * 2);
    durations.set(this._durations);
    this._durations = durations;
  }
}
