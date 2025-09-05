// Entry point for the application
require('dotenv').config(); // Ensure environment variables are loaded
const { initMongoConnection } = require('./db/initMongoConnection');
const setupServer = require('./server'); // Correctly import setupServer
const Contact = require('./db/models/Contact');

const startApp = async () => {
    await initMongoConnection();
    setupServer(); // Call the setupServer function
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
