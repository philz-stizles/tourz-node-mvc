/* eslint-disable new-cap */
const { MongoDataSource } = require('apollo-datasource-mongodb');
const { ApolloError } = require('apollo-server-express');
const User = require('../../../models/user.model');
const { generateToken } = require('../../../services/security/token.services');

class Users extends MongoDataSource {
  async getUser(id) {
    return await this.model.findById(id);
  }

  async create(newUser) {
    const createdUser = await new this.model(newUser).save();
    return createdUser;
  }

  async findByEmail(email) {
    const existingUser = await this.model.findOne({ email });
    return existingUser;
  }

  async login(credentials) {
    // Verify user email
    const existingUser = await this.model
      .findOne({ email: credentials.email })
      .select('+password');
    if (!existingUser) {
      throw new ApolloError('Email or password invalid', '400', {});
    }

    // Verify user password
    const isValid = await existingUser.comparePassword(credentials.password);
    if (!isValid) {
      throw new ApolloError('Email or password invalid', '400', {});
    }

    // Generate tokens
    const { _id, fullname, email, roles } = existingUser;
    const token = generateToken({ _id, email, roles });

    return {
      _id,
      fullname,
      email,
      token,
    };
  }
  // async getPrivateUserData(userId): Promise<any> {
  //   const isAuthorized = this.context.currentUserId === userId;
  //   if (isAuthorized) {
  //     const user = await this.findOneById(userId);
  //     return user && user.privateData;
  //   }
  // }
}

module.exports = new Users(User);
