import { Schema, model, Types, Document, PopulatedDoc, Model } from 'mongoose';
// Interfaces.
import { ITourDocument } from './tour.model';
import { IUserDocument } from './user.model';

// Create an interface representing a document in MongoDB.
interface ILog {
  code: string;
  rating: number;
  tours: PopulatedDoc<ITourDocument & Document>[];
  isActive: boolean;
  createdBy: PopulatedDoc<IUserDocument & Document>;
  createdAt: string;
  updatedAt: string;
}

export interface ILogDocument extends ILog, Document {}

interface ILogModel extends Model<ILogDocument> {
  aggregates(val: any[]): any;
}

// Put as much business logic in the models to keep the controllers as simple and lean as possible
const logSchema = new Schema(
  {
    code: { type: String, required: [true, 'Log code cannot be empty'] },
    rating: { type: Number, min: 1, max: 5 },
    tours: [
      {
        type: Types.ObjectId,
        ref: 'Tour',
        required: [true, 'Log must have one or more tours'],
      },
    ],
    isActive: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: [true, 'Log must have a creator'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // This makes sure that when we have a virtual property( i.e. a field that is not
    // stored in the DB but calculated using some other value) to show up whenever there is an output
    toObject: { virtuals: true }, // The same as above
  }
);

logSchema.index({ createdBy: 1 }); // Every Log must
// have a unique combination tour and creator, thus preventing duplicate Logs -
// multiple Logs from same user

export default model<ILogDocument, ILogModel>('Log', logSchema);
