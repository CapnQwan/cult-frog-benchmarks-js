/** biome-ignore-all lint/correctness/noUnusedVariables: unused variables in benchmarks are expected */
import { bench, describe, execute, output } from '@cult-frog/benchmarks';

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

describe('arrays', () => {
  const arr: number[] = [];

  describe('number array', () => {
    bench(
      'push 1k',
      () => {
        for (let i = 0; i < 1000; i++) arr.push(i);
      },
      { samples: 1000, warmupSamples: 1000 }
    );

    bench(
      'get 1k',
      () => {
        let s = 0;
        for (let i = 0; i < 1000; i++) s = arr[i];
      },
      { samples: 1000, warmupSamples: 1000 }
    );

    bench(
      'pop 1k',
      () => {
        for (let i = 0; i < 1000; i++) arr.pop();
      },
      { samples: 1000, warmupSamples: 1000 }
    );
  });

  const multiTypeArr: (number | string)[] = [];

  describe('multi type array', () => {
    bench(
      'push 1k',
      () => {
        for (let i = 0; i < 1000; i++) multiTypeArr.push(i % 2 === 0 ? i : `string ${i}`);
      },
      { samples: 1000, warmupSamples: 1000 }
    );

    bench(
      'get 1k',
      () => {
        let s: number | string = 0;
        for (let i = 0; i < 1000; i++) s = multiTypeArr[i];
      },
      { samples: 1000, warmupSamples: 1000 }
    );

    bench(
      'pop 1k',
      () => {
        for (let i = 0; i < 1000; i++) multiTypeArr.pop();
      },
      { samples: 1000, warmupSamples: 1000 }
    );
  });

  const objectArr: { id: number }[] = [];

  describe('object array', () => {
    bench(
      'push 1k',
      () => {
        for (let i = 0; i < 1000; i++) objectArr.push({ id: i });
      },
      { samples: 1000, warmupSamples: 1000 }
    );

    bench(
      'get 1k',
      () => {
        let s = 0;
        for (let i = 0; i < 1000; i++) s = objectArr[i].id;
      },
      { samples: 1000, warmupSamples: 1000 }
    );

    bench(
      'pop 1k',
      () => {
        for (let i = 0; i < 1000; i++) objectArr.pop();
      },
      { samples: 1000, warmupSamples: 1000 }
    );
  });
});

const results = execute();
output(results);
