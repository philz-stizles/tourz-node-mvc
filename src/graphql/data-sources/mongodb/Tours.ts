/* eslint-disable new-cap */
import { MongoDataSource } from 'apollo-datasource-mongodb';
import { ApolloError } from 'apollo-server-express';
import { IContext } from '@src/graphql/context';
import Tour, { ITourDocument } from '@src/models/tour.model';
import { ITourCreate, ITourUpdate } from '@src/interfaces/tour';

export class Tours extends MongoDataSource<ITourDocument, IContext> {
  async getById(id: string): Promise<ITourDocument | null | undefined> {
    return await this.model.findById(id);
  }

  async list(): Promise<ITourDocument[]> {
    return await this.model.find({});
  }

  async create(newTour: ITourCreate): Promise<ITourDocument> {
    // console.log(newTour);
    const createdTour = await new this.model(newTour).save();
    return createdTour;
  }

  async update(updatedTour: ITourUpdate): Promise<ITourDocument> {
    const {
      _id,
      title,
      description,
      price,
      category,
      subs,
      quantity,
      shipping,
      color,
      brand,
    } = updatedTour;
    const modifiedTour = await this.model.findByIdAndUpdate(
      _id,
      {
        title,
        description,
        price,
        category,
        subs,
        quantity,
        shipping,
        color,
        brand,
      },
      { new: true }
    );
    if (!modifiedTour) {
      throw new ApolloError('Tour does not exist', '404', {});
    }
    return modifiedTour;
  }

  async archive(id: string): Promise<ITourDocument> {
    const modifiedTour = await this.model.findByIdAndUpdate(
      id,
      {
        isActive: false,
      },
      { new: true }
    );
    if (!modifiedTour) {
      throw new ApolloError('Tour does not exist', '404', {});
    }
    return modifiedTour;
  }
}

export default new Tours(Tour);
