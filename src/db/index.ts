import mongoose, { Connection } from 'mongoose';

const mongooseConnect = async (url: string): Promise<void> => {
  try {
    const db = mongoose.connection as Connection;

    db.once('open', async () => {
      console.log('Connected to database');
    });

    db.on('error', () => {
      console.log('Error connecting to database');
    });

    db.on('error', () => {
      console.log('Disconnected from database');
    });

    await mongoose.connect(url);
  } catch (error: any | unknown) {
    console.log('Error connecting to database', error.message);
  }
};

export default mongooseConnect;
