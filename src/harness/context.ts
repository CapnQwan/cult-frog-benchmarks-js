import type { BenchOptions } from '../bench/_types/options.js';
import type { BenchCase } from './_types/benchCase.js';
import type { HarnessContext } from './_types/harnessContext.js';

/**
 * Key for the registry on `globalThis`. `Symbol.for` returns the same symbol for the same name
 * in every module, so every copy of this package finds the same registry.
 *
 * Different versions of the package can end up sharing it, so keep `HarnessContext` small and
 * stable, and change the key if its shape ever changes in a breaking way.
 */
const REGISTRY_KEY = Symbol.for('@cult-frog/benchmarks/registry');

type GlobalWithRegistry = typeof globalThis & { [REGISTRY_KEY]?: HarnessContext };

/**
 * The registry lives on `globalThis` rather than in a module-level variable so the CLI and the
 * bench files share it even when they load different copies of this package, such as when the
 * CLI runs from source while the bench files import the built package, or when two versions are
 * installed. A module-level variable would give each copy its own registry, and the CLI would
 * silently find no benchmarks.
 */
export function get(): HarnessContext {
  const global = globalThis as GlobalWithRegistry;
  global[REGISTRY_KEY] ??= { registered: [], groupStack: [] };
  return global[REGISTRY_KEY];
}

export function pushGroup(group: string) {
  get().groupStack.push(group);
}

export function popGroup() {
  get().groupStack.pop();
}

export function hasGroup() {
  return get().groupStack.length > 0;
}

export function registerCase(name: string, fn: () => unknown, options: BenchOptions) {
  const ctx = get();
  ctx.registered.push({ name, group: ctx.groupStack.join(' › '), fn, options });
}

/**
 * Removes and returns every benchmark registered so far. Bench files register when they are
 * imported, and a file is only imported once, so call this right after importing each file to
 * get that file's benchmarks; anything left behind is mixed into the next file's.
 */
export function takeRegistered(): BenchCase[] {
  return get().registered.splice(0);
}
