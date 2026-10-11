import { baseVitestConfig } from '@cult-frog/tooling/vitest/base';

export default baseVitestConfig({
  aliasName: '@cult-frog/benchmarks',
  testOverrides: {
    typecheck: { enabled: true, include: ['src/**/*.test-d.ts'] },
  },
});
