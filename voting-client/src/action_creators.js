export function setState(state) {
  return {
    type: 'SET_STATE',
    state
  };
}

export function vote(entry) {
  return {
    meta: {remote: true},
    type: 'VOTE',
    entry
  };
}

export function next() {
  return {
    meta: {remote: true},
    type: 'NEXT'
  };
}

export function reset() {
  return {
    meta: {remote: true},
    type: 'RESET'
  };
}

export function setConnectionStatus(connectionStatus) {
  return {
    type: 'CONNECTION_STATUS',
    connectionStatus
  };
}
