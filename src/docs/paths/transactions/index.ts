import list from './list';
import read from './read';
import update from './update';

export default {
  '/categories': {
    ...list,
  },
  '/categories/{slug}': {
    ...read,
    ...update,
  },
};
