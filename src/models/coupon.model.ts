import { Schema, model, Types, Document, PopulatedDoc, Model } from 'mongoose';
// Interfaces.
import { ITourDocument } from './tour.model';
import { IUserDocument } from './user.model';

// Create an interface representing a document in MongoDB.
interface ICoupon {
  code: string;
  rating: number;
  tours: PopulatedDoc<ITourDocument & Document>[];
  isActive: boolean;
  createdBy: PopulatedDoc<IUserDocument & Document>;
  createdAt: string;
  updatedAt: string;
}

export interface ICouponDocument extends ICoupon, Document {}

interface ICouponModel extends Model<ICouponDocument> {
  aggregates(val: any[]): any;
}

// Put as much business logic in the models to keep the controllers as simple and lean as possible
const couponSchema = new Schema(
  {
    code: { type: String, required: [true, 'Coupon code cannot be empty'] },
    rating: { type: Number, min: 1, max: 5 },
    tours: [
      {
        type: Types.ObjectId,
        ref: 'Tour',
        required: [true, 'Coupon must have one or more tours'],
      },
    ],
    isActive: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: [true, 'Coupon must have a creator'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // This makes sure that when we have a virtual property( i.e. a field that is not
    // stored in the DB but calculated using some other value) to show up whenever there is an output
    toObject: { virtuals: true }, // The same as above
  }
);

couponSchema.index({ createdBy: 1 }); // Every Coupon must
// have a unique combination tour and creator, thus preventing duplicate Coupons -
// multiple Coupons from same user

export default model<ICouponDocument, ICouponModel>('Coupon', couponSchema);
