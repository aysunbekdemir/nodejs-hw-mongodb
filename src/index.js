import 'dotenv/config'; 
import mongoose from 'mongoose';
import app from './server.js';

const { MONGODB_CONNECTION_STRING, PORT = 4000 } = process.env;

mongoose
  .connect(MONGODB_CONNECTION_STRING)
  .then(() => {
    console.log('Database connection successful');
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database. Error: ', error.message);
    process.exit(1);
  });