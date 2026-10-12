/** biome-ignore-all lint/correctness/noUnusedVariables: unused variables in benchmarks are expected */
import { bench, describe } from '@cult-frog/benchmarks';

describe('math', () => {
  describe('sum', () => {
    bench(
      'sum 1k',
      () => {
        let s = 0;
        for (let i = 0; i < 1000; i++) s += i;
      },
      { samples: 1000, warmupSamples: 0 }
    );

    bench(
      'sum 1k - warmup',
      () => {
        let s = 0;
        for (let i = 0; i < 1000; i++) s += i;
      },
      { samples: 1000, warmupSamples: 1000 }
    );

    bench(
      'sum 10k',
      () => {
        let s = 0;
        for (let i = 0; i < 10000; i++) s += i;
      },
      { samples: 1000, warmupSamples: 0 }
    );

    bench(
      'sum 10k - warmup',
      () => {
        let s = 0;
        for (let i = 0; i < 10000; i++) s += i;
      },
      { samples: 1000, warmupSamples: 1000 }
    );
  });

  describe('sub', () => {
    bench(
      'sub 1k',
      () => {
        let s = 0;
        for (let i = 0; i < 1000; i++) s -= i;
      },
      { samples: 1000, warmupSamples: 0 }
    );

    bench(
      'sub 1k - warmup',
      () => {
        let s = 0;
        for (let i = 0; i < 1000; i++) s -= i;
      },
      { samples: 1000, warmupSamples: 1000 }
    );

    bench(
      'sub 10k',
      () => {
        let s = 0;
        for (let i = 0; i < 10000; i++) s -= i;
      },
      { samples: 1000, warmupSamples: 0 }
    );

    bench(
      'sub 10k - warmup',
      () => {
        let s = 0;
        for (let i = 0; i < 10000; i++) s -= i;
      },
      { samples: 1000, warmupSamples: 1000 }
    );
  });
});
