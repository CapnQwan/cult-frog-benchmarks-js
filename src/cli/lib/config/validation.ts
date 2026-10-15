import { isString } from '@cult-frog/primitives';

import type { BenchmarkConfig } from './_types/config.js';

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export const CONFIG_VALIDATORS = {
  include: [isStringArray, 'String array'],
  exclude: [isStringArray, 'String array'],
  output: [isString, 'String'],
} as const;

export function validateField<K extends keyof BenchmarkConfig>(value: unknown, key: K): void {
  const [validator, expectedType] = CONFIG_VALIDATORS[key];
  if (validator === undefined) throw new Error(`Invalid key in config: ${key}`);
  if (!validator(value))
    throw new Error(`Invalid value for key ${key}: ${value} (expected ${expectedType})`);
}

export function isValidConfig(config: Record<string, unknown>): config is Partial<BenchmarkConfig> {
  for (const [key, value] of Object.entries(config)) {
    validateField(value, key as keyof BenchmarkConfig);
  }
  return true;
}
