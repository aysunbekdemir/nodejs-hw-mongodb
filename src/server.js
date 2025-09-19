import express from 'express';
import cors from 'cors';
import authRouter from './routers/auth.js';
import contactsRouter from './routers/contacts.js';
import errorHandler from './middlewares/errorHandler.js';

const setupServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.use('/api/auth', authRouter);
  app.use('/api/contacts', contactsRouter);

  app.use(errorHandler);

  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
};

export default setupServer;
