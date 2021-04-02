import { runParallel } from './parallel';
import { runSequence } from './sequence';

const run = (parallel = true, options: ClobbrRunSettings) => {
  if (parallel) {
    return runParallel(options);
  }

  return runSequence(options);
};

export default {
  run,
  runParallel,
  runSequence
};
