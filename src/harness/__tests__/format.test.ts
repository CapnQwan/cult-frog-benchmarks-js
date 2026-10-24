import { describe, expect, it } from 'vitest';

import { duration, format } from '../format.js';

import type { BenchmarkSummary } from '../../bench/_types/benchmarkSummary.js';
import type { BenchResult } from '../_types/benchResult.js';

const SUMMARY: BenchmarkSummary = {
  count: 1,
  iterations: 1,
  total: 1,
  min: 1,
  max: 1,
  mean: 1,
  sd: 0,
  rme: 0,
  p50: 1,
  p90: 1,
  p95: 1,
  p99: 1,
};

const result = (name: string, groups: string[]): BenchResult => ({
  name,
  groups,
  summary: SUMMARY,
});

/** Columns in a row are separated by at least two spaces. */
const COLUMN_GAP = /\s{2,}/;

/** Lines of `output` that start a group or a case, trimmed. */
const headingsAndNames = (output: string) =>
  output
    .split('\n')
    .filter((line) => line.trim() !== '' && !line.includes('mean'))
    .map((line) => line.trim().split(COLUMN_GAP)[0]);

describe('duration', () => {
  it('should pick a unit so small durations do not round to zero', () => {
    expect(duration(0.000_012_3).trim()).toBe('12.30 ns');
    expect(duration(0.0123).trim()).toBe('12.30 µs');
    expect(duration(12.3).trim()).toBe('12.30 ms');
  });

  it('should pad to a fixed column width', () => {
    expect(duration(0.0123)).toHaveLength(10);
  });
});

describe('format', () => {
  it('should keep groups in the order they first appear', () => {
    const output = format([
      result('sum', ['math', 'sum']),
      result('sub', ['math', 'sub']),
      result('sum again', ['math', 'sum']),
    ]);
    expect(headingsAndNames(output)).toEqual([
      'math › sum',
      'sum',
      'sum again',
      'math › sub',
      'sub',
    ]);
  });
});
