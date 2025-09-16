const express = require('express');
const cors = require('cors');
const pino = require('pino-http')();
const contactsRouter = require('./routers/contacts');
const authenticate = require('./middlewares/authenticate');

const setupServer = () => {
    const app = express();

    // Middleware'leri doğru sırada tanımlayın
    app.use(cors());
    app.use(pino);
    app.use(express.json()); // JSON formatındaki istek gövdelerini ayrıştırmak için
    app.use(express.urlencoded({ extended: true })); // URL-encoded istek gövdelerini ayrıştırmak için

    // Route'ları tanımlayın
    app.use('/api/contacts', contactsRouter);
    app.use('/contacts', authenticate, contactsRouter);

    // 404 handler
    app.use((req, res, next) => {
        res.status(404).json({ message: 'Not found' });
    });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

module.exports = setupServer;


