import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { createReport, REPORT_VERSION, write } from '../write.js';

import type { BenchFileResult } from '../_types/benchReport.js';

const DATE = new Date('2026-01-02T03:04:05.678Z');

const FILES: BenchFileResult[] = [
  {
    file: 'a.bench.ts',
    results: [
      {
        name: 'case',
        groups: ['group'],
        summary: {
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
        },
      },
    ],
  },
];

describe('createReport', () => {
  it('should record the date, runtime and machine alongside the results', () => {
    const report = createReport(FILES, DATE);
    expect(report).toMatchObject({
      version: REPORT_VERSION,
      date: '2026-01-02T03:04:05.678Z',
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      files: FILES,
    });
    expect(report.cpu).toEqual(expect.any(String));
  });
});

describe('write', () => {
  it('should write the report as JSON named after its date, creating the folder', () => {
    const directory = join(mkdtempSync(join(tmpdir(), 'cfbench-write-')), 'nested', 'out');
    const report = createReport(FILES, DATE);

    const path = write(directory, report);

    expect(basename(path)).toBe('2026-01-02T03-04-05-678Z.json');
    expect(JSON.parse(readFileSync(path, 'utf8'))).toEqual(report);
  });
});
