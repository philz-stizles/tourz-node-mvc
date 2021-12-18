const mongoose = require('mongoose');

module.exports = async db => {
  try {
    await mongoose.connect(db);

    console.log('Connected to database');
  } catch (error) {
    console.error(error.message);
  }
};
