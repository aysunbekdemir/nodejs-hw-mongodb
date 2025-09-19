import mongoose from 'mongoose';

const initMongoConnection = async () => {
  try {
    const { MONGODB_CONNECTION_STRING } = process.env;
    await mongoose.connect(MONGODB_CONNECTION_STRING);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Error while setting up mongo connection', error);
    process.exit(1);
  }
};

export default initMongoConnection;