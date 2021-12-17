import { Schema, model, Types, Document, PopulatedDoc, Model } from 'mongoose';
// Interfaces.
import { ITourDocument } from './tour.model';
import { IUser } from './user.model';
import Tour from '@src/models/tour.model';

// Create an interface representing a document in MongoDB.
export interface IReview {
  review: string;
  rating: number;
  isPaid: boolean;
  tour: PopulatedDoc<ITourDocument & Document>;
  createdBy: PopulatedDoc<IUser & Document>;
  createdAt: string;
  updatedAt: string;
}

export interface IReviewDocument extends IReview, Document {}

export interface IReviewModel extends Model<IReview> {
  aggregates(val: any[]): any;
}

// Put as much business logic in the models to keep the controllers as simple and lean as possible
const reviewSchema = new Schema<IReview>(
  {
    review: { type: String, required: [true, 'Review cannot be empty'] },
    rating: { type: Number, min: 1, max: 5 },
    tour: {
      type: Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must have a tour'],
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'Users',
      required: [true, 'Review must have a creator'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // This makes sure that when we have a virtual property( i.e. a field that is not
    // stored in the DB but calculated using some other value) to show up whenever there is an output
    toObject: { virtuals: true }, // The same as above
  }
);

reviewSchema.index({ tour: 1, creator: 1 }, { unique: true }); // Every review must
// have a unique combination tour and creator, thus preventing duplicate reviews -
// multiple reviews from same user

reviewSchema.pre(/^find/, function (next) {
  // this
  //     .populate({ path: 'tour', select: 'name -_id' }) // First query
  //     .populate({ path: 'creator', select: 'name photo -_id' }); // Second query // Rather than duplicating the populate query
  // // for every static method you use to retrieve the Model data, define it as a pre method and it will apply
  // // for all find queries - findById, findOne etc

  // It might not be necessary to display Tour, depending on your business model
  this.populate({ path: 'creator', select: 'name photo -_id' });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const review = this as IReviewModel;

  const stats = await review.aggregates([
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

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.review = await this.findOne();
  console.log(this.review);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.review.constructor.calcAverageRatings(this.review.tour);
});

export default model<IReview, IReviewModel>('Review', reviewSchema);
