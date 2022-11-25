import { Everbs } from './src/enums/http';
import { ClobbrEventCallback } from './src/models/ClobbrEvent';
import { ClobbrRequestSettings } from './src/models/ClobbrRequestSettings';
import { runParallel } from './src/parallel';
import { runSequence } from './src/sequence';
import * as resultMath from './src/resultMath';

export const parseOptions = (options?: ClobbrRequestSettings) => {
  if (!options) {
    return;
  }

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

  if (!parsedOptions) {
    return;
  }

  if (parallel) {
    return runParallel(parsedOptions, eventCallback);
  }

  return runSequence(parsedOptions, eventCallback);
};

export const mathUtils = resultMath;

export default {
  run,
  runParallel,
  runSequence,
  mathUtils
};
