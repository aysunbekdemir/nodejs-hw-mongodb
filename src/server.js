const express = require('express');
const cors = require('cors');
const pino = require('pino-http')();
const contactsRouter = require('./routers/contacts');
const authenticate = require('./middlewares/authenticate');

const setupServer = () => {
    const app = express();

    app.use(cors());
    app.use(pino);
    app.use(express.json());

    app.use('/contacts', authenticate, contactsRouter);

    app.use((req, res, next) => {
        res.status(404).json({ message: 'Not found' });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

module.exports = setupServer;


