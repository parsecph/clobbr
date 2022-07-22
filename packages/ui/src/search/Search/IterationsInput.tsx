import { useContext } from 'react';
import { isNumber } from 'lodash-es';

import { TextField } from '@mui/material';

import { MAX_ITERATIONS } from 'shared/consts/settings';

import { GlobalStore } from 'App/globalContext';

export const IterationsInput = ({
  customInputClasses,
  label,
  variant
}: {
  customInputClasses?: string;
  label?: string;
  variant?: 'outlined' | 'filled';
}) => {
  const globalStore = useContext(GlobalStore);

  const maxIterationCount = isNumber(globalStore.appSettings.maxIterations)
    ? globalStore.appSettings.maxIterations
    : MAX_ITERATIONS;

  const handleIterationChange =
    (updateIterations: (iterations: number) => void) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const numericValue = parseInt(event.target.value, 10);
      if (!event.target.value || isNaN(numericValue) || numericValue < 0) {
        updateIterations(1);
      } else if (
        !event.target.value ||
        isNaN(numericValue) ||
        numericValue > maxIterationCount
      ) {
        updateIterations(maxIterationCount);
      } else {
        updateIterations(numericValue);
      }
    };

  return (
    <GlobalStore.Consumer>
      {({ search }) => (
        <TextField
          label={label || 'Iterations'}
          variant={variant || 'outlined'}
          placeholder="10"
          id="iterations"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          value={search.iterations}
          onChange={handleIterationChange(search.updateIterations)}
          className={customInputClasses}
        />
      )}
    </GlobalStore.Consumer>
  );
};

export default IterationsInput;
