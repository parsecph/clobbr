export const WS_EVENTS = {
  API: {
    RUN: 'clobbr-api:run',
    RUN_CALLBACK: 'clobbr-api:run-callback',
    EMIT_LOG_RESPONSE: 'clobbr-api:emit-log'
  },
  SHELL: {
    RUN_SHELL_CMD: 'clobbr-api:run-shell-cmd'
  },
  NODE: {
    RUN_NODE_CMD: 'clobbr-api:run-node-cmd'
  },
  CORE: {
    WS_CONNECT: 'clobbr-core:ws-connect',
    WS_URL_SWITCH: 'clobbr-core:ws-url-switch'
  }
};
