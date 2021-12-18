module.exports = {
  categories(_category, _args, context) {
    const { isAuthenticated } = context;
    console.log('isAuthenticated', isAuthenticated);
    return context.dataSources.categories.getCategories();
  },
};
