// Entry point for the application
import 'dotenv/config'; // Ensure environment variables are loaded
import express from 'express';
import { initMongoConnection } from './db/initMongoConnection.js';
import setupServer from './server.js';
import { Contact } from './db/models/Contact.js';

const app = express();

// Middleware for parsing application/json
app.use(express.json());

// Middleware for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const startApp = async () => {
    await initMongoConnection(); // Start MongoDB connection
    setupServer(); // Start the server
};

const checkContacts = async () => {
    await initMongoConnection();
    const contacts = await Contact.find();
    if (contacts.length > 0) {
        console.log('Contacts found:', contacts);
    } else {
        console.log('No contacts found in the collection.');
    }
};

startApp();
checkContacts();

const bootstrap = async () => {
  try {
    await setupServer();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

bootstrap();
