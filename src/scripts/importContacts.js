require('dotenv').config();
const mongoose = require('mongoose');
const Contact = require('../db/models/Contact');
const contacts = require('../../contacts.json');

const importContacts = async () => {
    try {
        const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;
        const mongoUri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

        await mongoose.connect(mongoUri);
        console.log('MongoDB connected!');

        await Contact.insertMany(contacts);
        console.log('Contacts imported successfully!');
        process.exit();
    } catch (error) {
        console.error('Error importing contacts:', error);
        process.exit(1);
    }
};

importContacts();
