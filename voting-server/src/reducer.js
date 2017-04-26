import {setEntries, next, vote, reset, INITIAL_STATE} from './core';

export default function reducer(state = INITIAL_STATE, action) {
  console.log('in server reducer', action);
  switch (action.type) {
    case 'SET_ENTRIES':
      return setEntries(state, action.entries);
    case 'NEXT':
      return next(state);
    case 'VOTE':
      return state.update(
        'vote', voteState => vote(
          voteState, action.entry, action.voter));
    case 'RESET':
      return reset(state);
  }
  return state;
}
