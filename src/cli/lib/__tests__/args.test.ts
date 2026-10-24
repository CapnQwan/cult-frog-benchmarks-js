/** biome-ignore-all lint/security/noSecrets: Function names not secrets */

import { describe, expect, it } from 'vitest';

import { benchmarkCliArgs } from '../args.js';

describe('benchmarkCliArgs', () => {
  it('should default to not saving', () => {
    expect(benchmarkCliArgs([])).toEqual({ save: false, output: undefined });
  });

  it('should parse long and short flags', () => {
    expect(benchmarkCliArgs(['--save', '--output', 'out'])).toMatchObject({
      save: true,
      output: 'out',
    });
    expect(benchmarkCliArgs(['-s', '-o', 'out'])).toMatchObject({ save: true, output: 'out' });
  });

  it('should reject unknown flags, positionals and a missing output value', () => {
    expect(() => benchmarkCliArgs(['--nope'])).toThrow();
    expect(() => benchmarkCliArgs(['file.bench.ts'])).toThrow();
    expect(() => benchmarkCliArgs(['--output'])).toThrow();
  });
});
