import {List, Map} from 'immutable';
import {expect} from 'chai';

import {setEntries, next, vote, reset} from '../src/core';

describe('application logic', () => {

    describe('setEntries', () => {

        it('adds the entries to the state', () => {
            const state = Map();
            const entries = ['Trainspotting', '28 Days Later'];
            const nextState = setEntries(state, entries);
            expect(nextState).to.equal(Map({
                entries: List.of('Trainspotting', '28 Days Later'),
                originalEntries: List.of('Trainspotting', '28 Days Later')
            }));
        });
    });

    describe('next', () => {

        it('takes the next two entries under vote', () => {
            const state = Map({
                entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
            });

            const nextState = next(state);
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Trainspotting', '28 Days Later')
                }),
                entries: List.of('Sunshine'),
                round: 0
            }));
        });

        it('puts winner of current vote back to entries', () => {
            const state = Map({
              vote: Map({
                pair: List.of('Trainspotting', '28 Days Later'),
                tally: Map({
                  'Trainspotting': 4,
                  '28 Days Later': 2
                })
              }),
              entries: List.of('Sunshine', 'Millions', '127 Hours')
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
              vote: Map({
                pair: List.of('Sunshine', 'Millions')
              }),
              entries: List.of('127 Hours', 'Trainspotting'),
              round: 0
            }));
          });

        it('puts both from tied vote back to entries', () => {
          const state = Map({
            vote: Map({
              pair: List.of('Trainspotting', '28 Days Later'),
              tally: Map({
                'Trainspotting': 3,
                '28 Days Later': 3
              })
            }),
            entries: List.of('Sunshine', 'Millions', '127 Hours')
          });
          const nextState = next(state);
          expect(nextState).to.equal(Map({
            vote: Map({
              pair: List.of('Sunshine', 'Millions')
            }),
            entries: List.of('127 Hours', 'Trainspotting', '28 Days Later'),
            round: 0
          }));
        });

        it('marks winner when just one entry left', () => {
            const state = Map({
              vote: Map({
                pair: List.of('Trainspotting', '28 Days Later'),
                tally: Map({
                  'Trainspotting': 4,
                  '28 Days Later': 2
                })
              }),
              entries: List()
            });
            const nextState = next(state);

            expect(nextState).to.equal(Map({
              winner: 'Trainspotting'
            }));
        });

        it('iterates the round number', () => {
          const state = Map({
              entries: List.of('Trainspotting', '28 Days Later', 'Sunshine'),
              round: 0
          });
          const nextState = next(state);

          expect(nextState).to.equal(Map({
              vote: Map({
                  pair: List.of('Trainspotting', '28 Days Later')
              }),
              entries: List.of('Sunshine'),
              round: 1
          }));
        });
    });

    describe('vote', () => {

        it('only allows current pair entries to be voted on', () => {
          const state = Map({
            pair: List.of('Trainspotting', '28 Days Later')
          });
          const nextState = vote(state, 'Sunshine', 'voter1');

          expect(nextState).to.equal(Map({
            pair: List.of('Trainspotting', '28 Days Later')
          }));
        });

        it('creates a tally for the voted entry', () => {
            const state = Map({
              pair: List.of('Trainspotting', '28 Days Later')
            });
            const nextState = vote(state, 'Trainspotting', 'voter1');

            expect(nextState).to.equal(Map({
              pair: List.of('Trainspotting', '28 Days Later'),
              tally: Map({
                  'Trainspotting': 1
              }),
              votes: Map({
                voter1: 'Trainspotting'
              })
            }));
        });

        it('adds to existing tally for the voted entry', () => {
            const state = Map({
              pair: List.of('Trainspotting', '28 Days Later'),
              tally: Map({
                  'Trainspotting': 3,
                  '28 Days Later': 2
              })
            });
            const nextState = vote(state, 'Trainspotting', 'voter1');

            expect(nextState).to.equal(Map({
              pair: List.of('Trainspotting', '28 Days Later'),
              tally: Map({
                  'Trainspotting': 4,
                  '28 Days Later': 2
              }),
              votes: Map({
                voter1: 'Trainspotting'
              })
            }));
        });

        it('nullifies previous vote for the same voter', () => {
          const state = Map({
            round: 1,
            pair: List.of('Trainspotting', '28 Days Later'),
            tally: Map({
              'Trainspotting': 3,
              '28 Days Later': 2
            }),
            votes: Map({
              voter1: '28 Days Later'
            })
          });
          const nextState = vote(state, 'Trainspotting', 'voter1');

          expect(nextState).to.equal(Map({
            round: 1,
            pair: List.of('Trainspotting', '28 Days Later'),
            tally: Map({
              'Trainspotting': 4,
              '28 Days Later': 1
            }),
            votes: Map({
              voter1: 'Trainspotting'
            })
          }));
        });
    });

    describe('reset', () => {

      it('reverts back to the original entries with a pair and no votes', () => {
        expect(
          reset(
            Map({
              entries: List.of('Trainspotting'),
              originalEntries: List.of('Trainspotting', 'Sunshine', '28 Days Later', 'Trance', 'Steve Jobs'),
              round: 1,
              vote: Map({
                pair: List.of('28 Days Later', 'Trance'),
                tally: Map({
                  '28 Days Later': 4,
                  'Trance': 2
                })
              })
            })
          )
        ).to.equal(
          Map({
            entries: List.of('28 Days Later', 'Trance', 'Steve Jobs'),
            originalEntries: List.of('Trainspotting', 'Sunshine', '28 Days Later', 'Trance', 'Steve Jobs'),
            round: 0,
            vote: Map({
              pair: List.of('Trainspotting', 'Sunshine')
            })
          })
        );
      });

      it('reverts from winning state back to original entries', () => {
        expect(
          reset(
            Map({
              entries: List(),
              originalEntries: List.of('Trainspotting', 'Sunshine'),
              winner: 'Trainspotting'
            })
          )
        ).to.equal(
          Map({
            entries: List(),
            originalEntries: List.of('Trainspotting', 'Sunshine'),
            round: 0,
            vote: Map({
              pair: List.of('Trainspotting', 'Sunshine')
            })
          })
        );
      });

    });

});
