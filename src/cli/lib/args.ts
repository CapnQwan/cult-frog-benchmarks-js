import type { Args } from './_types/args.js';

export function parseArgs(): Args {
  const args = process.argv.slice(2);
  const argsObj: Args = {};

  let previousKey: string = '';

  for (const arg of args) {
    if (arg.startsWith('-')) {
      previousKey = arg;
      argsObj[previousKey] = [];
    } else {
      argsObj[previousKey]?.push(arg);
    }
  }

  return argsObj;
}
