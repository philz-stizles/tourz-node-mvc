/* eslint-disable @typescript-eslint/no-explicit-any */
const { MongoDataSource } = require('apollo-datasource-mongodb');
const Category = require('../../../models/category.model');

class Categories extends MongoDataSource {
  getCategory(id) {
    return this.findOneById(id);
  }

  getCategories() {
    return this.model.find();
  }
}

module.exports = new Categories(Category);
