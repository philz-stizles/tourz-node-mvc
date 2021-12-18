/* eslint-disable new-cap */
const { MongoDataSource } = require('apollo-datasource-mongodb');
const { ApolloError } = require('apollo-server-express');
const Tour = require('../../../models/tour.model');

class Tours extends MongoDataSource {
  async getById(id) {
    return await this.model.findById(id);
  }

  async list() {
    return await this.model.find({});
  }

  async create(newTour) {
    // console.log(newTour);
    const createdTour = await new this.model(newTour).save();
    return createdTour;
  }

  async update(updatedTour) {
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
    } = updatedTour;
    const modifiedTour = await this.model.findByIdAndUpdate(
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
    if (!modifiedTour) {
      throw new ApolloError('Tour does not exist', '404', {});
    }
    return modifiedTour;
  }

  async archive(id) {
    const modifiedTour = await this.model.findByIdAndUpdate(
      id,
      {
        isActive: false,
      },
      { new: true }
    );
    if (!modifiedTour) {
      throw new ApolloError('Tour does not exist', '404', {});
    }
    return modifiedTour;
  }
}

module.exports = new Tours(Tour);
