import Transaction from '@src/models/transaction.model';

describe('Transaction Model', () => {
  it('has all the required attributes', () => {
    const expectedKeys = ['transactionId', 'tour', 'createdBy', 'status'];
    const modelAttributes = Object.keys(Transaction.schema.paths);
    expect(expectedKeys.every(key => modelAttributes.includes(key))).toEqual(
      true
    );
  });

  // it('should create a new transaction', async () => {
  //   try {
  //     // Create new mock Transaction
  //     const newMockTransaction = {
  //       transactionId: 'Collectables co.',
  //       logo: Buffer.from([0b11110000, 0b10011111]),
  //       bio: 'A gadget selling company',
  //     };

  //     // Save new mock Transaction
  //     const createdMockTransaction = await new Transaction(
  //       newMockTransaction
  //     ).save();

  //     expect(createdMockTransaction._id).toBeDefined();
  //     expect(createdMockTransaction.name).toEqual(newMockTransaction.name);
  //     expect(createdMockTransaction.bio).toEqual(newMockTransaction.bio);
  //     expect(createdMockTransaction.createdAt).toBeDefined();
  //     expect(createdMockTransaction.updatedAt).toBeDefined();
  //   } catch (err: any | unknown) {
  //     throw new Error(err);
  //   }
  // });

  // it('should throw an error if the name field is empty', async () => {
  //   try {
  //     await new Transaction({
  //       name: '',
  //       logo: Buffer.from([0b11110000, 0b10011111]),
  //       bio: 'A gadget selling company',
  //     }).save();
  //   } catch (err: any | unknown) {
  //     expect(err.errors.name.kind).toEqual('required');
  //   }
  // });

  // it('should throw an error if the logo field is empty', async () => {
  //   try {
  //     await new Transaction({
  //       name: 'Collectables co.',
  //       bio: 'A gadget selling company',
  //     }).save();
  //   } catch (err: any | unknown) {
  //     expect(err.errors.logo.kind).toEqual('required');
  //   }
  // });

  // it('should throw an error if the bio field is empty', async () => {
  //   try {
  //     await new Transaction({
  //       name: 'Collectables co.',
  //       logo: Buffer.from([0b11110000, 0b10011111]),
  //       bio: '',
  //     }).save();
  //   } catch (err: any | unknown) {
  //     expect(err.errors.bio.kind).toEqual('required');
  //   }
  // });
});
