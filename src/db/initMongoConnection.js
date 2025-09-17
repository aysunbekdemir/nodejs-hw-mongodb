import mongoose from 'mongoose';
import { env } from '../utils/env.js';

export const initMongoConnection = async () => {
  // Eğer zaten bir bağlantı varsa, tekrar deneme
  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB connection is already established.');
    return;
  }

  try {
    const user = env('MONGODB_USER');
    const pwd = env('MONGODB_PASSWORD');
    const url = env('MONGODB_URL');
    const db = env('MONGODB_DB');

    const connectionString = `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`;
    await mongoose.connect(connectionString);
    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.error('Failed to establish Mongo connection:', e);
    throw e;
  }
};
