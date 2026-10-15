/** biome-ignore-all lint/security/noSecrets: Function names not secrets */

import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { loadBenchmarkConfig, parseBenchmarkConfig } from '../config.js';
import { DEFAULT_CONFIG } from '../default.js';

import type { BenchmarkConfig } from '../_types/config.js';

const VALID_INCLUDE = ['a', 'b'];
const VALID_EXCLUDE = ['c', 'd'];
const VALID_OUTPUT = 'output';

const VALID_CONFIG: BenchmarkConfig = {
  include: VALID_INCLUDE,
  exclude: VALID_EXCLUDE,
  output: VALID_OUTPUT,
};

describe('loadBenchmarkConfig', () => {
  it('should load the config from a valid config file', () => {
    const path = new URL('./valid-config.json', import.meta.url);
    const config = loadBenchmarkConfig(fileURLToPath(path));
    expect(config).toEqual(VALID_CONFIG);
  });

  it('should throw an error if the config file is invalid', () => {
    const path = new URL('./invalid-config.json', import.meta.url);
    expect(() => loadBenchmarkConfig(fileURLToPath(path))).toThrow();
  });

  it('should load the default config if the config file is not found', () => {
    const path = new URL('./not-found.json', import.meta.url);
    const config = loadBenchmarkConfig(fileURLToPath(path));
    expect(config).toEqual(DEFAULT_CONFIG);
  });
});

describe('parseBenchmarkConfig', () => {
  it('should parse the config from a valid config object', () => {
    let rawConfig = {};
    let parsedConfig = parseBenchmarkConfig(rawConfig);
    expect(parsedConfig).toEqual(DEFAULT_CONFIG);

    rawConfig = VALID_CONFIG;
    parsedConfig = parseBenchmarkConfig(rawConfig);
    expect(parsedConfig).toEqual(VALID_CONFIG);

    rawConfig = { include: VALID_INCLUDE };
    parsedConfig = parseBenchmarkConfig(rawConfig);
    expect(parsedConfig.include).toEqual(VALID_INCLUDE);
    expect(parsedConfig.exclude).toEqual(DEFAULT_CONFIG.exclude);
    expect(parsedConfig.output).toEqual(DEFAULT_CONFIG.output);
  });

  it('should throw an error if there are any invalid config fields', () => {
    expect(() => parseBenchmarkConfig({ include: 'a' })).toThrow();
    expect(() => parseBenchmarkConfig({ include: 1 })).toThrow();
    expect(() => parseBenchmarkConfig({ include: [1, 1] })).toThrow();
    expect(() => parseBenchmarkConfig({ include: ['a', 1] })).toThrow();
    expect(() => parseBenchmarkConfig({ exclude: 'a' })).toThrow();
    expect(() => parseBenchmarkConfig({ exclude: 1 })).toThrow();
    expect(() => parseBenchmarkConfig({ exclude: [1, 1] })).toThrow();
    expect(() => parseBenchmarkConfig({ exclude: ['a', 1] })).toThrow();
    expect(() => parseBenchmarkConfig({ output: 1 })).toThrow();
    expect(() => parseBenchmarkConfig({ output: ['a', 1] })).toThrow();
  });
});
