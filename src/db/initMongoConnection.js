const mongoose = require('mongoose');

const initMongoConnection = async () => {
    try {
        const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;
        const mongoUri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

        await mongoose.connect(mongoUri); // Ensure the connection URI is correct
        console.log('Mongo connection successfully established!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

module.exports = { initMongoConnection };
