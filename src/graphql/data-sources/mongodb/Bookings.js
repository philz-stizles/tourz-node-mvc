const { MongoDataSource } = require('apollo-datasource-mongodb');
const Booking = require('../../../models/booking.model');

class Bookings extends MongoDataSource {
  getCart(id) {
    return this.findOneById(id);
  }
}

module.exports = new Bookings(Booking);
