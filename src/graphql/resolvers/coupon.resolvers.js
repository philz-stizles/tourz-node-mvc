/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
const { PubSub } = require('graphql-subscriptions');
const { AuthenticationError } = require('apollo-server-express');

const pubsub = new PubSub();

exports.couponMutations = {
  createCoupon: async (_parent, args, context) => {
    const { isAuthenticated, dataSources } = context;
    if (!isAuthenticated) {
      throw new AuthenticationError('Please register to complete this process');
    }
    const createdCoupon = await dataSources.coupons.create(args.data);

    pubsub.publish('COUPON_CREATED', { createdCoupon });

    return {
      statusCode: 201,
      message: 'Created successful',
      status: true,
      data: createdCoupon,
    };
  },
  updateCoupon: async (_parent, args, context) => {
    const updatedCoupon = await context.dataSources.coupons.update(args.data);
    return {
      statusCode: 200,
      message: 'Updated successful',
      status: true,
      data: updatedCoupon,
    };
  },
  archiveCoupon: async (_parent, args, context) => {
    const loggedInUser = await context.dataSources.coupons.archive(args.id);
    return {
      statusCode: 200,
      message: 'Archived successful',
      status: true,
      data: loggedInUser,
    };
  },
};

exports.couponQueries = {
  async coupons(_parent, _args, context) {
    return await context.dataSources.coupons.list();
  },
};

exports.couponSubscriptions = {
  createdCoupon: {
    subscribe: () => pubsub.asyncIterator(['COUPON_CREATED']),
  },
};
