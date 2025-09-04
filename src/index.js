// Entry point for the application
const { setupServer } = require('./server');
const { initMongoConnection } = require('./db/initMongoConnection');

const startApp = async () => {
    await initMongoConnection();
    setupServer();
};

startApp();
