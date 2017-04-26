import voter from './voter';

export default socket => store => next => action => {
  console.log('in middleware', action);
  if (action.meta && action.meta.remote) {
    action.voter = store.getState().get('voter');
    socket.emit('action', action);
  }
  return next(action);
}
