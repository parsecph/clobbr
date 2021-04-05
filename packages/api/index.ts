import { Everbs } from './src/enums/http';
import { ClobbrEventCallback } from './src/models/ClobbrEvent';
import { ClobbrRequestSettings } from './src/models/ClobbrRequestSettings';
import { runParallel } from './src/parallel';
import { runSequence } from './src/sequence';

export const parseOptions = (options?: ClobbrRequestSettings) => {
  return {
    ...options,
    verb: options.verb.toLowerCase() as Everbs,
    iterations: parseInt(options.iterations.toString(), 10)
  };
};

export const run = (
  parallel: boolean,
  options: ClobbrRequestSettings,
  eventCallback?: ClobbrEventCallback
) => {
  const parsedOptions = parseOptions(options);

  if (parallel) {
    return runParallel(parsedOptions, eventCallback);
  }

  return runSequence(parsedOptions, eventCallback);
};

export default {
  run,
  runParallel,
  runSequence
};
