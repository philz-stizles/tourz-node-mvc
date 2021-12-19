// Data Stores. ***************************************************** |
const UserStore = require('./mongodb/Users');
const RoleStore = require('./mongodb/Roles');
const CouponStore = require('./mongodb/Coupons');
const TourStore = require('./mongodb/Tours');
const CategoryStore = require('./mongodb/Categories');
const BookingStore = require('./mongodb/Bookings');
const ReviewStore = require('./mongodb/Reviews');

// Return initialized data stores to. ******************************* |
module.exports = () => {
  // const client = new MongoClient('mongodb://localhost:27017/test');
  // client.connect();

  return {
    users: UserStore,
    roles: RoleStore,
    bookings: BookingStore,
    categories: CategoryStore,
    coupons: CouponStore,
    tours: TourStore,
    reviews: ReviewStore,
    // users: new Users(client.db().collection('users')),
  };
};
