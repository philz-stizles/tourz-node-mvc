import mongoose from 'mongoose';
import Log from '@src/models/log.model';

describe('Log Model', () => {
  it('has all the required attributes', () => {
    const expectedKeys = ['name', 'slug', 'category', 'createdBy'];
    const modelAttributes = Object.keys(Log.schema.paths);
    expect(expectedKeys.every(key => modelAttributes.includes(key))).toEqual(
      true
    );
  });

  it('should create a new category', async () => {
    try {
      // Create new mock Log
      const newMockLog = {
        name: 'Shoes',
        slug: 'shoes',
        category: new mongoose.Types.ObjectId(),
        createdBy: new mongoose.Types.ObjectId(),
      };

      // Save new mock Log
      const createdMockLog = await new Log(newMockLog).save();

      expect(createdMockLog._id).toBeDefined();
      expect(createdMockLog.createdBy.toHexString()).toEqual(
        newMockLog.createdBy.toHexString()
      );
    } catch (err: any | unknown) {
      throw new Error(err);
    }
  });

  it('should throw an error if the name field is empty', async () => {
    try {
      await new Log({
        name: '',
        slug: 'shoes',
        category: new mongoose.Types.ObjectId(),
        createdBy: new mongoose.Types.ObjectId(),
      }).save();
    } catch (err: any | unknown) {
      expect(err.errors.name.kind).toEqual('required');
    }
  });

  it('should throw an error if the name field is duplicated', async () => {
    try {
      // Create new mock Log
      const newMockLog = {
        name: 'Shoes',
        slug: 'shoes',
        category: new mongoose.Types.ObjectId(),
        createdBy: new mongoose.Types.ObjectId(),
      };

      // Save new mock Log
      await new Log(newMockLog).save();

      // Save duplicate mock Log
      await new Log(newMockLog).save();
    } catch (err: any | unknown) {
      expect(err.code).toEqual(11000);
    }
  });

  it('should throw an error if the slug field is empty', async () => {
    try {
      await new Log({
        name: 'Shoes',
        slug: '',
        category: new mongoose.Types.ObjectId(),
        createdBy: new mongoose.Types.ObjectId(),
      }).save();
    } catch (err: any | unknown) {
      expect(err.errors.slug.kind).toEqual('required');
    }
  });

  it('should throw an error if the category field is empty', async () => {
    try {
      await new Log({
        name: 'Shoes',
        slug: 'shoes',
        createdBy: new mongoose.Types.ObjectId(),
      }).save();
    } catch (err: any | unknown) {
      expect(err.errors.category.kind).toEqual('required');
    }
  });
});
