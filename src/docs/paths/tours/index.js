const create = require('./create');
const list = require('./list');
const read = require('./read');
const update = require('./update');

module.exports = {
  '/products': {
    ...create,
    ...list,
  },
  '/products/{slug}': {
    ...read,
  },
  '/products/{id}': {
    ...update,
  },
};
