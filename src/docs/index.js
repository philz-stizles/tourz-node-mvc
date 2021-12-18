const basicInfo = require('./basicInfo');
const servers = require('./servers');
const components = require('./components');
const tags = require('./tags');
const auth = require('./paths/auth');
const users = require('./paths/users');
const categories = require('./paths/categories');
const coupons = require('./paths/coupons');
const tours = require('./paths/tours');

module.exports = {
  ...basicInfo,
  servers,
  components,
  tags,
  paths: {
    ...auth,
    ...users,
    ...categories,
    ...coupons,
    ...tours,
  },
  // security: [{ bearerAuth: [] }], this applies
};
