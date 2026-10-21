import { describe, expect, it } from 'vitest';

import { duration } from '../format.js';

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
