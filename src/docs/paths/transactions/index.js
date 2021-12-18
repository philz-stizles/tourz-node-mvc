const create = require('./create');
const list = require('./list');
const read = require('./read');
const update = require('./update');

module.exports = {
  '/categories': {
    ...create,
    ...list,
  },
  '/categories/{slug}': {
    ...read,
    ...update,
  },
};
