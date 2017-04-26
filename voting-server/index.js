import makeStore from './src/store';
import startServer from './src/server';

console.log("starting server");

export const store = makeStore();
startServer(store);

store.dispatch({
  type: 'SET_ENTRIES',
  entries: require('./entries.json')
});
store.dispatch({type: 'NEXT'});

console.log("server started");
