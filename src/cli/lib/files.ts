import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

import type { Matcher } from './matcher/index.js';

/**
 * Finds the files under `root` that match an include pattern and no exclude pattern. Patterns
 * are matched against paths relative to `root`. Returns absolute paths in a stable order.
 *
 * Excluded folders are skipped without being read, so excluding `node_modules` costs nothing
 * instead of walking every installed package first. A folder is skipped when its path
 * with a trailing `/` matches an exclude. That is only possible when the pattern ends in `/**`,
 * which also matches everything inside the folder, so skipping it never drops a file that
 * would have been kept.
 */
export function findFiles(
  root: string,
  includes: readonly Matcher[],
  excludes: readonly Matcher[]
): string[] {
  const files: string[] = [];
  const isExcluded = (path: string) => excludes.some((matcher) => matcher.isMatch(path));

  const walk = (directory: string) => {
    const entries = readdirSync(directory, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      const fullPath = join(directory, entry.name);
      const relativePath = relative(root, fullPath);

      if (entry.isDirectory()) {
        if (!isExcluded(`${relativePath}/`)) walk(fullPath);
        continue;
      }

      if (!includes.some((matcher) => matcher.isMatch(relativePath))) continue;
      if (isExcluded(relativePath)) continue;
      files.push(fullPath);
    }
  };

  walk(root);
  return files;
}
