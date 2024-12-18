import { Everbs } from './src/enums/http';
import { ClobbrEventCallback } from './src/models/ClobbrEvent';
import { ClobbrRequestSettings } from './src/models/ClobbrRequestSettings';
import { runParallel } from './src/parallel';
import { runSequence } from './src/sequence';
import * as resultMath from './src/resultMath';

export const parseOptions = (options?: ClobbrRequestSettings) => {
  if (!options) {
    console.error('Options are required.');
    return;
  }

  if (!options.url) {
    console.error('URL is required.');
    return;
  }

  if (!options.verb) {
    console.error('Verb is required.');
    return;
  }

  if (!options.iterations) {
    console.error('Iterations is required.');
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
  eventCallback?: ClobbrEventCallback,
  abortControllerCallback?: (abortControllers: AbortController[]) => void
) => {
  const parsedOptions = parseOptions(options);

  if (!parsedOptions) {
    console.warn('Did not run, options were invalid.');
    return;
  }

  // Create abort controllers before sending requests
  const abortControllers = Array(parsedOptions.iterations)
    .fill(null)
    .map(() => new AbortController());

  abortControllerCallback?.(abortControllers);

  if (parallel) {
    return runParallel(parsedOptions, eventCallback, abortControllers);
  }

  return runSequence(parsedOptions, eventCallback, abortControllers);
};

export const mathUtils = resultMath;

export default {
  run,
  runParallel,
  runSequence,
  mathUtils
};
