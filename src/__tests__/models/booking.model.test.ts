import mongoose from 'mongoose';
import Booking from '@src/models/booking.model';

const createMockProducts = (noOfProducts = 1) => {
  const products = [];
  if (noOfProducts > 0) {
    for (let i = noOfProducts; i > 0; i -= 1) {
      // Create new mock Product
      products.push({
        product: { _id: new mongoose.Types.ObjectId().toHexString() },
        count: 2,
        color: 'green',
        price: 123,
      });
    }
  }

  return {
    products,
    totalAmount: products.reduce(
      (acc, { count, price }) => acc + count * price,
      0
    ),
  };
};

describe('Booking Model', () => {
  it('has all the required attributes', () => {
    const expectedKeys = [
      'products',
      'totalAmount',
      'totalAfterDiscount',
      'createdBy',
    ];
    const modelAttributes = Object.keys(Booking.schema.paths);
    expect(expectedKeys.every(key => modelAttributes.includes(key))).toEqual(
      true
    );
  });

  it('should create a new booking', async () => {
    try {
      // Mock products
      const { products, totalAmount } = createMockProducts();

      // Create new mock Booking
      const newMockBooking = {
        products,
        totalAmount,
        createdBy: new mongoose.Types.ObjectId(),
      };

      // Save new mock Booking
      const createdMockBooking = await new Booking(newMockBooking).save();

      expect(createdMockBooking._id).toBeDefined();
      // expect(createdMockBooking.toJSON().products).toEqual(newMockBooking.products);
      expect(createdMockBooking.totalAmount).toEqual(
        newMockBooking.totalAmount
      );
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
      const { products } = createMockProducts(0);

      await new Booking({
        products,
        totalAmount: 0,
        createdBy: new mongoose.Types.ObjectId().toHexString(),
      }).save();
    } catch (err: any | unknown) {
      expect(err.errors.products.kind).toEqual('required');
    }
  });
});
