/* eslint-disable new-cap */
const { MongoDataSource } = require('apollo-datasource-mongodb');
const { ApolloError } = require('apollo-server-express');
const Review = require('../../../models/review.model');

class Reviews extends MongoDataSource {
  async getById(id) {
    return await this.model.findById(id);
  }

  async list() {
    return await this.model.find({});
  }

  async create(newProduct) {
    // console.log(newProduct);
    const createdProduct = await new this.model(newProduct).save();
    return createdProduct;
  }

  async update(updatedProduct) {
    const {
      _id,
      title,
      description,
      price,
      category,
      subs,
      quantity,
      shipping,
      color,
      brand,
    } = updatedProduct;
    const modifiedProduct = await this.model.findByIdAndUpdate(
      _id,
      {
        title,
        description,
        price,
        category,
        subs,
        quantity,
        shipping,
        color,
        brand,
      },
      { new: true }
    );
    if (!modifiedProduct) {
      throw new ApolloError('Product does not exist', '404', {});
    }
    return modifiedProduct;
  }

  async archive(id) {
    const modifiedProduct = await this.model.findByIdAndUpdate(
      id,
      {
        isActive: false,
      },
      { new: true }
    );
    if (!modifiedProduct) {
      throw new ApolloError('Product does not exist', '404', {});
    }
    return modifiedProduct;
  }
}

module.exports = new Reviews(Review);
