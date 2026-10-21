import { isRecord, isString } from '@cult-frog/primitives';

import type { BenchmarkConfig } from './_types/config.js';

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export const CONFIG_VALIDATORS = {
  include: [isStringArray, 'String array'],
  exclude: [isStringArray, 'String array'],
  output: [isString, 'String'],
} as const;

function isConfigKey(key: string): key is keyof BenchmarkConfig {
  return Object.hasOwn(CONFIG_VALIDATORS, key);
}

export function validateField(value: unknown, key: string): void {
  if (!isConfigKey(key)) throw new Error(`Invalid key in config: ${key}`);
  const [validator, expectedType] = CONFIG_VALIDATORS[key];
  if (!validator(value))
    throw new Error(`Invalid value for key ${key}: ${value} (expected ${expectedType})`);
}

export function isValidConfig(config: unknown): config is Partial<BenchmarkConfig> {
  // Arrays and null parse as JSON objects too, so check the shape before reading entries
  if (!isRecord(config)) throw new Error('Invalid config: expected a JSON object');
  for (const [key, value] of Object.entries(config)) {
    validateField(value, key);
  }
  return true;
}
