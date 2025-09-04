const express = require('express');
const cors = require('cors');
const pino = require('pino-http')();
const contactsController = require('./controllers/contactsController');

const setupServer = () => {
    const app = express();

    app.use(cors());
    app.use(pino);

    app.get('/contacts', contactsController.getAllContacts);
    app.get('/contacts/:contactId', contactsController.getContactById);

    app.use((req, res, next) => {
        res.status(404).json({ message: 'Not found' });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

module.exports = setupServer;

