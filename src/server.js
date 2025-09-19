import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import contactsRouter from './routes/contacts.js';
import authRouter from './routes/auth.js';

const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // Rota Yönlendiricileri
  app.use('/api/contacts', contactsRouter);
  app.use('/api/auth', authRouter);
  // Sağlık kontrolü rotası
  app.get('/', (req, res) => {
    res.json({
      message: 'Hello World!',
    });
  });

  // Hata yönetimi middleware'i
  app.use((err, req, res, next) => {
    console.error('API Error:', err.stack); // Hatanın tüm detaylarını loglamak için
    if (err.status) {
      return res.status(err.status).json({
        message: err.message,
        status: err.status,
      });
    }
    res.status(500).json({ message: 'Something went wrong', status: 500 });
  });

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
