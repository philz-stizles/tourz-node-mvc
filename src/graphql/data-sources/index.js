// import { MongoClient } from 'mongodb';
const UserStore, { Users } = require('./mongodb/Users');
const CouponStore, { Coupons } = require('./mongodb/Coupons');
const ProductStore, { Tours } = require('./mongodb/Tours');
const Categories = require('./mongodb/Categories');
const Carts = require('./mongodb/Carts');
const Category = require('../../models/user.model');
const Cart = require('../../models/cart.model');

module.exports = () => {
  // const client = new MongoClient('mongodb://localhost:27017/test');
  // client.connect();

  return {
    users: UserStore,
    carts: new Carts(Cart),
    categories: new Categories(Category),
    coupons: CouponStore,
    products: ProductStore,
    // users: new Users(client.db().collection('users')),
  };
};
