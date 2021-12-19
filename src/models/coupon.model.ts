import { Schema, model, Types, Document, PopulatedDoc, Model } from 'mongoose';
// Interfaces.
import { ITourDocument } from './tour.model';
import { IUserDocument } from './user.model';
import Tour from '@src/models/tour.model';

// Create an interface representing a document in MongoDB.
export interface ICoupon {
  coupon: string;
  rating: number;
  isPaid: boolean;
  tour: PopulatedDoc<ITourDocument & Document>;
  createdBy: PopulatedDoc<IUserDocument & Document>;
  createdAt: string;
  updatedAt: string;
}

export interface ICouponDocument extends ICoupon, Document {}

export interface ICouponModel extends Model<ICoupon> {
  aggregates(val: any[]): any;
}

// Put as much business logic in the models to keep the controllers as simple and lean as possible
const couponSchema = new Schema(
  {
    coupon: { type: String, required: [true, 'Coupon cannot be empty'] },
    rating: { type: Number, min: 1, max: 5 },
    tour: {
      type: Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Coupon must have a tour'],
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'Users',
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

couponSchema.index({ tour: 1, creator: 1 }, { unique: true }); // Every Coupon must
// have a unique combination tour and creator, thus preventing duplicate Coupons -
// multiple Coupons from same user

couponSchema.pre(/^find/, function (next) {
  // this
  //     .populate({ path: 'tour', select: 'name -_id' }) // First query
  //     .populate({ path: 'creator', select: 'name photo -_id' }); // Second query // Rather than duplicating the populate query
  // // for every static method you use to retrieve the Model data, define it as a pre method and it will apply
  // // for all find queries - findById, findOne etc

  // It might not be necessary to display Tour, depending on your business model
  this.populate({ path: 'creator', select: 'name photo -_id' });

  next();
});

couponSchema.statics.calcAverageRatings = async function (tourId) {
  const Coupon = this as ICouponModel;

  const stats = await Coupon.aggregates([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        ratingCount: { $sum: 1 },
        ratingAvg: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].ratingCount,
      ratingsAverage: stats[0].ratingAvg,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

couponSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

couponSchema.pre(/^findOneAnd/, async function (next) {
  this.Coupon = await this.findOne();
  console.log(this.Coupon);
  next();
});

couponSchema.post(/^findOneAnd/, async function () {
  await this.Coupon.constructor.calcAverageRatings(this.Coupon.tour);
});

export default model<ICouponDocument, ICouponModel>('Coupon', couponSchema);
