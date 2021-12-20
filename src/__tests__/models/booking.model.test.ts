import mongoose from 'mongoose';
import Booking from '@src/models/booking.model';
import Tour from '@src/models/tour.model';

const createMockTour = async () =>
  await new Tour({
    startLocation: {
      description: 'Miami, USA',
      type: 'Point',
      coordinates: [-80.185942, 25.774772],
      address: '301 Biscayne Blvd, Miami, FL 33132, USA',
    },
    ratingsAverage: 4.8,
    ratingsQuantity: 6,
    images: ['tour-2-1.jpg', 'tour-2-2.jpg', 'tour-2-3.jpg'],
    startDates: [
      '2021-06-19T09:00:00.000Z',
      '2021-07-20T09:00:00.000Z',
      '2021-08-18T09:00:00.000Z',
    ],
    name: 'The Sea Explorer',
    duration: 7,
    maxGroupSize: 15,
    difficulty: 'medium',
    guides: ['5c8a22c62f8fb814b56fa18b', '5c8a1f4e2f8fb814b56fa185'],
    price: 497,
    summary: 'Exploring the jaw-dropping US east coast by foot and by boat',
    description:
      'Excepteur sint occaecat cupidatat eserunt mollit anim id est laborum.\n Lorem sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis  in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    imageCover: 'tour-2-cover.jpg',
    locations: [
      {
        _id: '5c88fa8cf4afda39709c2959',
        description: 'Lummus Park Beach',
        type: 'Point',
        coordinates: [-80.128473, 25.781842],
        day: 1,
      },
    ],
  }).save();

describe('Booking Model', () => {
  it('has all the required attributes', () => {
    const expectedKeys = ['price', 'tour', 'isPaid', 'createdBy'];
    const modelAttributes = Object.keys(Booking.schema.paths);
    expect(expectedKeys.every(key => modelAttributes.includes(key))).toEqual(
      true
    );
  });

  it('should create a new booking', async () => {
    try {
      // Mock products
      const tour = await createMockTour();

      // Create new mock Booking
      const newMockBooking = {
        tour: tour.id,
        price: tour.price,
        createdBy: new mongoose.Types.ObjectId(),
      };

      // Save new mock Booking
      const createdMockBooking = await new Booking(newMockBooking).save();

      expect(createdMockBooking._id).toBeDefined();
      // expect(createdMockBooking.toJSON().products).toEqual(newMockBooking.products);
      expect(createdMockBooking.price).toEqual(newMockBooking.price);
      expect(createdMockBooking.createdBy.toHexString()).toEqual(
        newMockBooking.createdBy.toHexString()
      );
      expect(createdMockBooking.createdAt).toBeDefined();
      expect(createdMockBooking.updatedAt).toBeDefined();
    } catch (err: any | unknown) {
      throw new Error(err);
    }
  });

  // it('should throw an error if the products field is empty', async () => {
  //   try {
  //     await new Booking({
  //       totalAmount: 23,
  //       createdBy: new mongoose.Types.ObjectId().toHexString(),
  //     }).save();
  //   } catch (err: any | unknown) {
  //     expect(err.errors.products.kind).toEqual('required');
  //   }
  // });

  it('should throw an error if the totalAmount field is empty', async () => {
    try {
      // Mock products
      const tour = await createMockTour();

      await new Booking({
        tour: tour.id,
        totalAmount: 0,
        createdBy: new mongoose.Types.ObjectId().toHexString(),
      }).save();
    } catch (err: any | unknown) {
      expect(err.errors.products.kind).toEqual('required');
    }
  });
});
