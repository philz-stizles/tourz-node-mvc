import { Schema, model, Types, Document, PopulatedDoc, Model } from 'mongoose';
import { ITourDocument } from './tour.model';
import { IUserDocument } from './user.model';

// Create an interface representing a document in MongoDB.
interface ITransaction {
  transactionId: string;
  tour: PopulatedDoc<ITourDocument & Document>;
  createdBy: PopulatedDoc<IUserDocument & Document>;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITransactionDocument extends ITransaction, Document {}

interface ITransactionModel extends Model<ITransactionDocument> {}

// Put as much business logic in the models to keep the controllers as simple and lean as possible
// 2. Create a Schema corresponding to the document interface.
const schema = new Schema(
  {
    transactionId: {
      type: String,
      required: [true, 'A user must have a fullname'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    tour: { type: Types.ObjectId, ref: 'Tour' },
    createdBy: { type: Types.ObjectId, ref: 'User' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Create and export model.
export default model<ITransactionDocument>('Transaction', schema);
