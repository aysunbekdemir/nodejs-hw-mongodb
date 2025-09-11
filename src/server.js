const express = require('express');
const cors = require('cors');
const pino = require('pino-http')();
const authRouter = require('./routers/auth');
const contactsRouter = require('./routers/contacts');
const authenticate = require('./middlewares/authenticate');
const notFoundHandler = require('./middlewares/notFoundHandler');
const errorHandler = require('./middlewares/errorHandler');

const setupServer = () => {
    const app = express();

    app.use(cors());
    app.use(pino);
    app.use(express.json());

    app.use('/auth', authRouter);
    app.use('/contacts', authenticate, contactsRouter);

    // Handle undefined routes
    app.use(notFoundHandler);

    // Global error handler
    app.use(errorHandler);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

module.exports = setupServer;


