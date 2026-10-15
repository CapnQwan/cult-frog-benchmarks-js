import { describe, expect, it } from 'vitest';

import { tValue95 } from '../tValue.js';

describe('tValue95', () => {
  it('should return table values for small degrees of freedom', () => {
    expect(tValue95(1)).toEqual(12.706);
    expect(tValue95(10)).toEqual(2.228);
    expect(tValue95(30)).toEqual(2.042);
  });

  it('should approach the normal value for large degrees of freedom', () => {
    expect(tValue95(1000)).toEqual(1.96);
  });

  it('should return NaN when there are no degrees of freedom', () => {
    expect(tValue95(0)).toBeNaN();
  });
});
