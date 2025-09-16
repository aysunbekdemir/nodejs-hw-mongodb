// Entry point for the application
require('dotenv').config(); // Ensure environment variables are loaded
const express = require('express');
const { initMongoConnection } = require('./db/initMongoConnection');
const setupServer = require('./server');
const Contact = require('./db/models/Contact');

const app = express();

// Middleware for parsing application/json
app.use(express.json());

// Middleware for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const startApp = async () => {
    await initMongoConnection(); // MongoDB bağlantısını başlat
    setupServer(); // Sunucuyu başlat
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
