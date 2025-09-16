const express = require('express');
const cors = require('cors');
const pino = require('pino-http')();
const contactsRouter = require('./routers/contacts');
const authenticate = require('./middlewares/authenticate');

const setupServer = () => {
    const app = express();

    app.use(cors());
    app.use(pino);
    app.use(express.json()); // JSON parse middleware

    app.use('/contacts', authenticate, contactsRouter);

    app.use((req, res, next) => {
        res.status(404).json({ message: 'Not found' });
    });

    const PORT = process.env.PORT || 4000; // Changed default port to 4000
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

module.exports = setupServer;


