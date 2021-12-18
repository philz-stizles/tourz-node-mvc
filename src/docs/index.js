const basicInfo = require('./basicInfo');
const servers = require('./servers');
const components = require('./components');
const tags = require('./tags');
const auth = require('./paths/auth');
const subCategories = require('./paths/sub-categories');
const categories = require('./paths/categories');
const coupons = require('./paths/coupons');
const products = require('./paths/products');

module.exports = {
  ...basicInfo,
  servers,
  components,
  tags,
  paths: {
    ...auth,
    ...subCategories,
    ...categories,
    ...coupons,
    ...products,
  },
  // security: [{ bearerAuth: [] }], this applies
};
