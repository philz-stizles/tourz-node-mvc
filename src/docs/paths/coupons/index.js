const create = require('./create');
const list = require('./list');
const archive = require('./archive');

module.exports = {
  '/coupons': {
    ...create,
    ...list,
  },
  '/coupons/{id}': {
    ...archive,
  },
};
