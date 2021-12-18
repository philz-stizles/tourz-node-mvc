// const { ICategoryDocument } = require('@src/models/category.model';
// const { Query } = require('mongoose';

module.exports = {
  categories(_category, _args, context) {
    return context.dataSources.categories.getCategories();
  },
};
