import mongoose from 'mongoose';
import Coupon from '@src/models/coupon.model';

describe('Coupon Model', () => {
  it('has all the required attributes', () => {
    const expectedKeys = ['code', 'expiry', 'discount', 'createdBy'];
    const modelAttributes = Object.keys(Coupon.schema.paths);
    expect(expectedKeys.every(key => modelAttributes.includes(key))).toEqual(
      true
    );
  });

  it('should create a new coupon', async () => {
    try {
      // Create new mock Coupon
      const newMockCoupon = {
        code: 'SEW123',
        expiry: new Date(),
        discount: 12,
        createdBy: new mongoose.Types.ObjectId(),
      };

      // Save new mock Coupon
      const createdMockCoupon = await new Coupon(newMockCoupon).save();

      expect(createdMockCoupon._id).toBeDefined();
      expect(createdMockCoupon.code).toEqual(newMockCoupon.code);
      expect(createdMockCoupon.expiry).toEqual(newMockCoupon.expiry);
      expect(createdMockCoupon.discount).toEqual(newMockCoupon.discount);
      expect(createdMockCoupon.createdBy.toHexString()).toEqual(
        newMockCoupon.createdBy.toHexString()
      );
      expect(createdMockCoupon.createdAt).toBeDefined();
      expect(createdMockCoupon.updatedAt).toBeDefined();
    } catch (err: any | unknown) {
      throw new Error(err);
    }
  });

  it('should throw an error if the name field is empty', async () => {
    try {
      await new Coupon({
        code: '',
        expiry: new Date(),
        discount: 12,
        createBy: new mongoose.Types.ObjectId().toHexString(),
      }).save();
    } catch (err: any | unknown) {
      expect(err.errors.code.kind).toEqual('required');
    }
  });

  it('should throw an error if the expiry field is empty', async () => {
    try {
      await new Coupon({
        code: 'SEW123',
        discount: 12,
        createBy: new mongoose.Types.ObjectId().toHexString(),
      }).save();
    } catch (err: any | unknown) {
      expect(err.errors.expiry.kind).toEqual('required');
    }
  });

  it('should throw an error if the code field is duplicated', async () => {
    try {
      // Create new mock Coupon
      const newMockCoupon = {
        code: 'SEW123',
        expiry: new Date(),
        discount: 12,
        createBy: new mongoose.Types.ObjectId().toHexString(),
      };

      // Save new mock Coupon
      await new Coupon(newMockCoupon).save();

      // Save duplicate mock Coupon
      await new Coupon(newMockCoupon).save();
    } catch (err: any | unknown) {
      expect(err.code).toEqual(11000);
    }
  });

  it('should throw an error if the discount field is empty', async () => {
    try {
      await new Coupon({
        code: 'SEW123',
        expiry: new Date(),
        createBy: new mongoose.Types.ObjectId().toHexString(),
      }).save();
    } catch (err: any | unknown) {
      expect(err.errors.discount.kind).toEqual('required');
    }
  });

  it('should throw an error if the createdBy field is empty', async () => {
    try {
      await new Coupon({
        code: 'SEW123',
        expiry: new Date(),
        discount: 12,
      }).save();
    } catch (err: any | unknown) {
      expect(err.errors.createdBy.kind).toEqual('required');
    }
  });
});
