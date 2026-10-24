export interface BenchmarkOptions {
  /** Save the results to the config's `output` folder. */
  save: boolean;
  /** Folder to save the results to instead of the config's `output`. Implies `save`. */
  output: string | undefined;
}
