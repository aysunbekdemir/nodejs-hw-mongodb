// Entry point for the application
require('dotenv').config(); // Ensure environment variables are loaded
const { initMongoConnection } = require('./db/initMongoConnection');
const setupServer = require('./server'); // Correctly import setupServer

const startApp = async () => {
    await initMongoConnection();
    setupServer(); // Call the setupServer function
};

startApp();
