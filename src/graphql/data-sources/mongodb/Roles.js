/* eslint-disable new-cap */
const { MongoDataSource } = require('apollo-datasource-mongodb');
const { ApolloError } = require('apollo-server-express');
const Role = require('../../../models/role.model');
const { generateToken } = require('../../../services/security/token.services');

class Roles extends MongoDataSource {
  async getRole(id) {
    return await this.model.findById(id);
  }

  async create(newRole) {
    const createdRole = await new this.model(newRole).save();
    return createdRole;
  }

  async findByEmail(email) {
    const existingRole = await this.model.findOne({ email });
    return existingRole;
  }

  async login(credentials) {
    // Verify Role email
    const existingRole = await this.model
      .findOne({ email: credentials.email })
      .select('+password');
    if (!existingRole) {
      throw new ApolloError('Email or password invalid', '400', {});
    }

    // Verify Role password
    const isValid = await existingRole.comparePassword(credentials.password);
    if (!isValid) {
      throw new ApolloError('Email or password invalid', '400', {});
    }

    // Generate tokens
    const { _id, fullname, email, roles } = existingRole;
    const token = generateToken({ _id, email, roles });

    return {
      _id,
      fullname,
      email,
      token,
    };
  }
  // async getPrivateRoleData(RoleId): Promise<any> {
  //   const isAuthorized = this.context.currentRoleId === RoleId;
  //   if (isAuthorized) {
  //     const Role = await this.findOneById(RoleId);
  //     return Role && Role.privateData;
  //   }
  // }
}

module.exports = new Roles(Role);
