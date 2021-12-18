// // import { MongoClient } = require('mongodb');
// import User = require('@src/models/user.model');
// import Users = require('@src/graphql/dataSources/mongodb/Users');
// import Carts = require('@src/graphql/dataSources/mongodb/Carts');
// import Cart = require('@src/models/cart.model');

// type MongoDataSources = {
//   users: Users;
//   carts: Carts;
// };

// export default (): MongoDataSources => {
//   // const client = new MongoClient('mongodb://localhost:27017/test');
//   // client.connect();

//   return {
//     users: new Users(User),
//     carts: new Carts(Cart),
//   };
// };
