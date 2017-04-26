import {List, Map} from 'immutable';
import voter from './voter';
import {ConnectionStatusEnum} from './components/ConnectionStatus';

function setState(state, newState) {

  // Reset the vote state if this is a new round
  // or we don't have any votes
  const vote = newState.vote;
  if (state.get('round') != newState.round ||
      !(vote && vote.votes)) {
    state = resetVote(state);
  }

  return state.merge(newState);
}

function vote(state, entry) {
  const currentPair = state.getIn(['vote', 'pair']);
  if (currentPair && currentPair.includes(entry)) {
    return state.set('hasVoted', entry);
  } else {
    return state;
  }
}

function resetVote(state) {
  return state.remove('hasVoted');
}

function setConnectionStatus(state, connectionStatus) {
  return state.set('connectionStatus', connectionStatus);
}

function initializeState() {
  return Map({
    voter: voter(),
    connectionStatus: ConnectionStatusEnum.Disconnect
  });
}

export default function(state = initializeState(), action) {
  switch(action.type) {
    case 'SET_STATE':
      return setState(state, action.state);
    case 'VOTE':
      return vote(state, action.entry, action.voter);
    case 'CONNECTION_STATUS':
      return setConnectionStatus(state, action.connectionStatus);
  }
  return state;
}
