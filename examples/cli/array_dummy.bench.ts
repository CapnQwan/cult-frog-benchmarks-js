/** biome-ignore-all lint/correctness/noUnusedVariables: unused variables in benchmarks are expected */
import { bench, describe } from '@cult-frog/benchmarks';

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
