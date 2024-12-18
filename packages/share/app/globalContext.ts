import { createContext } from 'react';

// A mock of the global context that is used in the app
export const GlobalStore = createContext({
  search: {
    inProgress: false
  }
});
