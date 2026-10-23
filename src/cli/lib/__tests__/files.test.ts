import { chmodSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

import { DEFAULT_CONFIG } from '../config/default.js';
import { findFiles } from '../files.js';
import { Matcher } from '../matcher/index.js';

const INCLUDES = DEFAULT_CONFIG.include.map((pattern) => Matcher.create(pattern));
const EXCLUDES = DEFAULT_CONFIG.exclude.map((pattern) => Matcher.create(pattern));

/** Creates an empty file at each path under a new temp directory and returns the directory. */
function createProject(paths: string[]): string {
  const root = mkdtempSync(join(tmpdir(), 'cfbench-files-'));
  for (const path of paths) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), '');
  }
  return root;
}

function find(root: string, excludes = EXCLUDES): string[] {
  return findFiles(root, INCLUDES, excludes).map((path) =>
    relative(root, path).replace(/\\/g, '/')
  );
}

describe('findFiles', () => {
  it('should find matching files at any depth, in a stable order', () => {
    const root = createProject(['b.bench.ts', 'src/x/a.bench.js', 'src/a.bench.ts', 'src/a.ts']);
    expect(find(root)).toEqual(['b.bench.ts', 'src/a.bench.ts', 'src/x/a.bench.js']);
  });

  it('should skip default-excluded folders at any depth', () => {
    const root = createProject([
      'a.bench.ts',
      'node_modules/pkg/a.bench.ts',
      'packages/app/node_modules/pkg/a.bench.ts',
      'packages/app/dist/a.bench.js',
      'packages/app/src/a.bench.ts',
    ]);
    expect(find(root)).toEqual(['a.bench.ts', 'packages/app/src/a.bench.ts']);
  });

  it('should not read excluded folders', () => {
    const root = createProject(['a.bench.ts', 'node_modules/locked/a.bench.ts']);
    // Reading this folder would throw EACCES, so the walk must skip it without looking inside
    const locked = join(root, 'node_modules/locked');
    chmodSync(locked, 0o000);
    try {
      expect(find(root)).toEqual(['a.bench.ts']);
    } finally {
      chmodSync(locked, 0o755);
    }
  });

  it('should still apply excludes that match files rather than folders', () => {
    const root = createProject(['a.bench.ts', 'src/slow.bench.ts']);
    const excludes = [...EXCLUDES, Matcher.create('**/slow.bench.ts')];
    expect(find(root, excludes)).toEqual(['a.bench.ts']);
  });
});
