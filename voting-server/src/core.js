import {List, Map} from 'immutable'

export const INITIAL_STATE = Map();

export function setEntries(state, entries) {
  const entriesList = List(entries);
  return state
    .set('entries', entriesList)
    .set('originalEntries', entriesList);
}

function getWinners(vote) {
    if (!vote) {
        return [];
    }

    const [a, b] = vote.get('pair');
    const aVotes = vote.getIn(['tally', a], 0);
    const bVotes = vote.getIn(['tally', b], 0);

    if      (aVotes > bVotes)  return [a];
    else if (aVotes < bVotes)  return [b];
    else                       return [a, b];
}

export function next(state) {
    const entries = state.get('entries')
        .concat(getWinners(state.get('vote')));

    if (entries.size === 1) {
        return state.remove('vote')
            .remove('entries')
            .remove('originalEntries')
            .remove('round')
            .set('winner', entries.first());
    }

    return state.merge({
        vote: Map({
            pair: entries.take(2)
        }),
        entries: entries.skip(2),
        round: state.has('round') ? state.get('round') + 1 : 0
    });
}

export function vote(voteState, entry, voter) {

  const pair = voteState.get('pair');
  if (!(pair && pair.includes(entry))) {
    return voteState;
  }

  // If we don't have vote state yet, create it
  if (!voteState.has('votes')) {
    voteState = voteState.set('votes', Map());
  }

  const votes = voteState.get('votes');

  // If the user has voted already then decrement the previous vote tally
  if (votes.has(voter)) {
    voteState = voteState.updateIn(['tally', votes.get(voter)], 0, tally => tally - 1)
  }

  return voteState
      .updateIn(['tally', entry], 0, tally => tally + 1)
      .setIn(['votes', voter], entry);
}

export function reset(state) {
  return next(state
    .set('entries', state.get('originalEntries'))
    .remove('vote')
    .remove('round')
    .remove('winner')
  );
}
