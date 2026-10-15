import { describe, expect, it } from 'vitest';

import { BenchmarkRecorder } from '../benchmarkRecorder.js';

describe('BenchmarkRecorder', () => {
  it('should grow past its initial capacity', () => {
    const recorder = new BenchmarkRecorder(1);
    for (let i = 0; i < 5; i++) {
      recorder.start();
      recorder.end(1);
    }

    const summary = recorder.summarize();
    expect(summary.count).toEqual(5);
    expect(Number.isFinite(summary.max)).toBe(true);
    expect(Number.isFinite(summary.mean)).toBe(true);
  });

  it('should report no margin of error for a single sample', () => {
    const recorder = new BenchmarkRecorder();
    recorder.start();
    recorder.end(1);

    const summary = recorder.summarize();
    expect(summary.sd).toEqual(0);
    expect(summary.rme).toEqual(0);
  });

  it('should throw when nothing was recorded', () => {
    expect(() => new BenchmarkRecorder().summarize()).toThrow();
  });
});
