import mongoose from 'mongoose';

const mongooseConnect = async (dbUri: string): Promise<void> => {
  console.log(dbUri);
  try {
    await mongoose.connect(dbUri, {});
    console.log('after connect');

    // const db = mongoose.connection as Connection;

    // db.once('open', async () => {
    //   console.log('Connected to database');
    // });

    // db.on('error', () => {
    //   console.log('Error connecting to database');
    // });

    // db.on('error', () => {
    //   console.log('Disconnected from database');
    // });
  } catch (error: any | unknown) {
    console.log('Error connecting to database', error.message);
  }
};

export default mongooseConnect;
