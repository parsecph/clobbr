export const INTERNAL_WSS_URL = 'ws://localhost:8923/ws';

export const WS_EVENTS = {
  API: {
    RUN: 'clobbr-api:run',
    RUN_CALLBACK: 'clobbr-api:run-callback'
  },
  SHELL: {
    RUN_SHELL_CMD: 'clobbr-api:run-shell-cmd'
  },
  NODE: {
    RUN_NODE_CMD: 'clobbr-api:run-node-cmd'
  }
};
