const { Schema, model } = require('mongoose');

// Put as much business logic in the models to keep the controllers as simple and lean as possible
const bookingSchema = new Schema(
  {
    creator: {
      type: Schema.ObjectId,
      ref: 'Users',
      required: [true, 'A creator is required'],
    },
    tour: {
      type: Schema.ObjectId,
      ref: 'Tours',
      required: [true, 'A tour is required'],
    },
    price: { type: Number, required: [true, 'Booking must have a price'] },
    paid: { type: Boolean, default: true },
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

module.exports = model('Bookings', bookingSchema);
