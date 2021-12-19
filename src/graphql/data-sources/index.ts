// import { MongoClient } from 'mongodb';
import UserStore, { Users } from '@src/graphql/data-sources/mongodb/Users';
import CouponStore, {
  Coupons,
} from '@src/graphql/data-sources/mongodb/Coupons';
import TourStore, { Tours } from '@src/graphql/data-sources/mongodb/Tours';
import CategoryStore, {
  Categories,
} from '@src/graphql/data-sources/mongodb/Categories';
import BookingStore, {
  Bookings,
} from '@src/graphql/data-sources/mongodb/Bookings';
import ReviewStore, {
  Reviews,
} from '@src/graphql/data-sources/mongodb/Reviews';

type MongoDataSources = {
  users: Users;
  bookings: Bookings;
  categories: Categories;
  coupons: Coupons;
  tours: Tours;
  reviews: Reviews;
};

export default (): MongoDataSources => {
  // const client = new MongoClient('mongodb://localhost:27017/test');
  // client.connect();

  return {
    users: UserStore,
    bookings: BookingStore,
    categories: CategoryStore,
    coupons: CouponStore,
    tours: TourStore,
    reviews: ReviewStore,
    // users: new Users(client.db().collection('users')),
  };
};
