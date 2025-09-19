// Entry point for the application
import { config } from 'dotenv';
import initMongoConnection from './db/initMongoConnection.js';
import setupServer from './server.js';

config(); // Ensure environment variables are loaded

const bootstrap = async () => {
  await initMongoConnection();
  setupServer();
};

bootstrap();
