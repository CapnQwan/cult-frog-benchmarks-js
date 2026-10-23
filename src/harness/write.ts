import { mkdirSync, writeFileSync } from 'node:fs';
import { cpus } from 'node:os';
import { join } from 'node:path';

import type { BenchFileResult, BenchReport } from './_types/benchReport.js';

export const REPORT_VERSION = 1;

/** Wraps the results of a run with the date and the machine and runtime they were measured on. */
export function createReport(files: BenchFileResult[], date: Date = new Date()): BenchReport {
  return {
    version: REPORT_VERSION,
    date: date.toISOString(),
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    cpu: cpus()[0]?.model ?? 'unknown',
    files,
  };
}

/**
 * Writes `report` as JSON into `directory`, creating it if needed, and returns the file's path.
 * Files are named after the report's date (`:` and `.` swapped for `-`, as Windows doesn't allow
 * `:` in names), so they sort in run order and one run never overwrites another.
 */
export function write(directory: string, report: BenchReport): string {
  mkdirSync(directory, { recursive: true });
  const path = join(directory, `${report.date.replace(/[:.]/g, '-')}.json`);
  writeFileSync(path, `${JSON.stringify(report, null, 2)}\n`);
  return path;
}
