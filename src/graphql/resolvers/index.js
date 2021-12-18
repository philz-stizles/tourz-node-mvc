// const { IResolvers } = require('@graphql-tools/utils';
const {
  GraphQLUpload,
  graphqlUploadExpress, // A Koa implementation is also exported.
} = require('graphql-upload');
const { finished } = require('stream/promises');
const {
  authMutations,
  authQueries,
} = require('@src/graphql/resolvers/auth.resolvers');
const { categoryQueries } = require('@src/graphql/resolvers/category');
const { subCategoryQueries } = require('@src/graphql/resolvers/sub-category');
const {
  productQueries,
  productMutations,
} = require('@src/graphql/resolvers/product.resolvers');
const {
  couponMutations,
  couponQueries,
  couponSubscriptions,
} = require('@src/graphql/resolvers/coupon.resolvers');

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
