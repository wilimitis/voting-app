import uuid from 'uuid';

export default function() {

  if (typeof localStorage === 'undefined') {
    return 'default';
  }

  let id = localStorage.getItem('voter');
  if (!id) {
    id = uuid.v4();
    localStorage.setItem('voter', id);
  }
  return id;
}
