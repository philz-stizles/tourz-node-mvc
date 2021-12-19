import { MongoDataSource } from 'apollo-datasource-mongodb';
import { Types } from 'mongoose';
import Review, { IReviewDocument } from '@src/models/review.model';
import { IContext } from '@src/graphql/context';

export class Reviews extends MongoDataSource<IReviewDocument, IContext> {
  getCart(id: Types.ObjectId): Promise<IReviewDocument | null | undefined> {
    return this.findOneById(id);
  }
}

export default new Reviews(Review);
