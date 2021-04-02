import { Everbs } from './enums/http';
import { ClobbrEventCallback } from './models/ClobbrEvent';
import { ClobbrRunSettings } from './models/ClobbrRunSettings';
import { runParallel } from './parallel';
import { runSequence } from './sequence';

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
