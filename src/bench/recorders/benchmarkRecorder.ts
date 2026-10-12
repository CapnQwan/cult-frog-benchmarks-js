import { nearestPercentile } from '../percentiles/nearestPercentile.js';

import type { BenchmarkSummary } from '../_types/benchmarkSummary.js';

export class BenchmarkRecorder {
  private _durations: Float64Array;
  private _count = 0;
  private _tickStart = 0;

  constructor(capacity: number = 100_000) {
    this._durations = new Float64Array(capacity);
  }

  public get count(): number {
    return this._count;
  }

  public start(): void {
    this._tickStart = performance.now();
  }

  public end(): void {
    const end = performance.now();
    this._durations[this._count] = end - this._tickStart;
    this._count++;
  }

  public summarize(): BenchmarkSummary {
    const count = this._count;
    if (count === 0) throw new Error('TickRecorder:summarise() - no ticks recorded');

    const sorted = this._durations.slice(0, count).sort();

    let total = 0;
    sorted.forEach((duration) => {
      total += duration;
    });

    return {
      count,
      total: sorted.reduce((a, b) => a + b, 0),
      min: sorted[0]!,
      max: sorted[count - 1]!,
      mean: total / count,
      p50: nearestPercentile(sorted, 50) ?? 0,
      p90: nearestPercentile(sorted, 90) ?? 0,
      p95: nearestPercentile(sorted, 95) ?? 0,
      p99: nearestPercentile(sorted, 99) ?? 0,
    };
  }
}
