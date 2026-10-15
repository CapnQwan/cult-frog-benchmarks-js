import { bench, describe } from '@cult-frog/benchmarks';

// Each call must leave shared state as it found it: calls are batched, so a benchmark
// that grows or drains a shared array measures a different array on every call.

const SIZE = 1000;

describe('arrays', () => {
  describe('number array', () => {
    const filled = Array.from({ length: SIZE }, (_, i) => i);

    bench(
      'push 1k',
      () => {
        const arr: number[] = [];
        for (let i = 0; i < SIZE; i++) arr.push(i);
        return arr;
      },
      { samples: 1000 }
    );

    bench(
      'get 1k',
      () => {
        let s = 0;
        for (let i = 0; i < SIZE; i++) s += filled[i] ?? 0;
        return s;
      },
      { samples: 1000 }
    );

    bench(
      'copy + pop 1k',
      () => {
        const arr = filled.slice();
        for (let i = 0; i < SIZE; i++) arr.pop();
        return arr;
      },
      { samples: 1000 }
    );
  });

  describe('multi type array', () => {
    const filled = Array.from({ length: SIZE }, (_, i) => (i % 2 === 0 ? i : `string ${i}`));

    bench(
      'push 1k',
      () => {
        const arr: (number | string)[] = [];
        for (let i = 0; i < SIZE; i++) arr.push(i % 2 === 0 ? i : `string ${i}`);
        return arr;
      },
      { samples: 1000 }
    );

    bench(
      'get 1k',
      () => {
        let s = 0;
        for (let i = 0; i < SIZE; i++) if (filled[i] !== undefined) s++;
        return s;
      },
      { samples: 1000 }
    );

    bench(
      'copy + pop 1k',
      () => {
        const arr = filled.slice();
        for (let i = 0; i < SIZE; i++) arr.pop();
        return arr;
      },
      { samples: 1000 }
    );
  });

  describe('object array', () => {
    const filled = Array.from({ length: SIZE }, (_, i) => ({ id: i }));

    bench(
      'push 1k',
      () => {
        const arr: { id: number }[] = [];
        for (let i = 0; i < SIZE; i++) arr.push({ id: i });
        return arr;
      },
      { samples: 1000 }
    );

    bench(
      'get 1k',
      () => {
        let s = 0;
        for (let i = 0; i < SIZE; i++) s += filled[i]?.id ?? 0;
        return s;
      },
      { samples: 1000 }
    );

    bench(
      'copy + pop 1k',
      () => {
        const arr = filled.slice();
        for (let i = 0; i < SIZE; i++) arr.pop();
        return arr;
      },
      { samples: 1000 }
    );
  });
});
