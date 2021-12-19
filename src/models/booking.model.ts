import { Model, model, PopulatedDoc, Schema, Types } from 'mongoose';
// Interfaces.
import { ITourDocument } from './tour.model';
import { IUserDocument } from './user.model';

// Create an interface representing a document in MongoDB.
interface IBooking {
  price: number;
  isPaid: boolean;
  tour: PopulatedDoc<ITourDocument & Document>;
  createdBy: PopulatedDoc<IUserDocument & Document>;
  createdAt: string;
  updatedAt: string;
}

export interface IBookingDocument extends IBooking, Document {}

interface IBookingModel extends Model<IBookingDocument> {}

// Put as much business logic in the models to keep the controllers as simple and lean as possible
const bookingSchema = new Schema(
  {
    tour: {
      type: Types.ObjectId,
      ref: 'Tour',
      required: [true, 'A tour is required'],
    },
    price: { type: Number, required: [true, 'Booking must have a price'] },
    isPaid: { type: Boolean, default: true },
    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: [true, 'A booking must be created by a user'],
    },
  },
  { timestamps: true }
);

bookingSchema.pre(/^find/, function (next) {
  // this
  //     .populate({ path: 'tour', select: 'name -_id' }) // First query
  //     .populate({ path: 'creator', select: 'name photo -_id' }); // Second query // Rather than duplicating the populate query
  // // for every static method you use to retrieve the Model data, define it as a pre method and it will apply
  // // for all find queries - findById, findOne etc

  // It might not be necessary to display Tour, depending on your business model
  this.populate('creator', 'name').populate({ path: 'tour', select: 'name' });

  next();
});

export default model<IBookingDocument, IBookingModel>('Booking', bookingSchema);
