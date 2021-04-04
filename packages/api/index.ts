import { Everbs } from './src/enums/http';
import { ClobbrEventCallback } from './src/models/ClobbrEvent';
import { ClobbrRunSettings } from './src/models/ClobbrRunSettings';
import { runParallel } from './src/parallel';
import { runSequence } from './src/sequence';

export const parseOptions = (options?: ClobbrRunSettings) => {
  return {
    ...options,
    verb: options.verb.toLowerCase() as Everbs,
    iterations: parseInt(options.iterations.toString(), 10)
  };
};

export const run = (
  parallel: boolean,
  options: ClobbrRunSettings,
  eventCallback: ClobbrEventCallback = () => null
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
