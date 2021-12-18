/* eslint-disable new-cap */
const { MongoDataSource } = require('apollo-datasource-mongodb');
const { ApolloError } = require('apollo-server-express');
const Coupon = require('../../../models/coupon.model');

class Coupons extends MongoDataSource {
  async getById(id) {
    return await this.model.findById(id);
  }

  async list() {
    return await this.model.find({});
  }

  async create(newCoupon) {
    const createdCoupon = await new this.model(newCoupon).save();
    return createdCoupon;
  }

  async update(updatedCoupon) {
    const { _id, expiry, discount } = updatedCoupon;
    const modifiedCoupon = await this.model.findByIdAndUpdate(
      _id,
      { expiry, discount },
      { new: true }
    );
    if (!modifiedCoupon) {
      throw new ApolloError('Coupon does not exist', '404', {});
    }
    return modifiedCoupon;
  }

  async archive(id) {
    const modifiedCoupon = await this.model.findByIdAndUpdate(
      id,
      {
        isActive: false,
      },
      { new: true }
    );
    if (!modifiedCoupon) {
      throw new ApolloError('Coupon does not exist', '404', {});
    }
    return modifiedCoupon;
  }
}

module.exports = new Coupons(Coupon);
