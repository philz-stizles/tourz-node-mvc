const {
  GraphQLUpload,
  graphqlUploadExpress, // A Koa implementation is also exported.
} = require('graphql-upload');
const { finished } = require('stream/promises');
const { authMutations, authQueries } = require('./auth.resolvers');
const { categoryQueries } = require('./category');
const { subCategoryQueries } = require('./sub-category');
const { productQueries, productMutations } = require('./product.resolvers');
const {
  couponMutations,
  couponQueries,
  couponSubscriptions,
} = require('./coupon.resolvers');

module.exports = {
  // This maps the `Upload` scalar to the implementation provided
  // by the `graphql-upload` package.
  Upload: GraphQLUpload,
  Query: {
    ...authQueries,
    ...categoryQueries,
    ...subCategoryQueries,
    ...productQueries,
    ...couponQueries,
  },
  Mutation: {
    ...authMutations,
    ...couponMutations,
    ...productMutations,
  },
  Subscription: {
    ...couponSubscriptions,
  },
};
