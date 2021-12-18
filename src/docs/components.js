const sharedSchemas = require('./schemas/shared.schemas');
const authSchemas = require('./schemas/auth.schemas');
const categorySchemas = require('./schemas/category.schemas');
const subCategorySchemas = require('./schemas/sub-category.schemas');
const couponSchemas = require('./schemas/coupon.schemas');
const productSchemas = require('./schemas/product.schemas');

module.exports = {
  schemas: {
    ...sharedSchemas,
    ...authSchemas,
    ...categorySchemas,
    ...subCategorySchemas,
    ...couponSchemas,
    ...productSchemas,
  },
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
  responses: {
    UnauthorizedError: {
      description: 'Access token is missing or invalid',
    },
  },
};
