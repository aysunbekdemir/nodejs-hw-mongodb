import express from 'express';
import cors from 'cors';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import contactsRouter from './routes/api/contacts.js';
import usersRouter from './routes/api/users.js';

const app = express();

app.use(express.json());
app.use(cors());

// Swagger UI için statik dosya sunumu
app.use('/api-docs', express.static('docs'));

// Rotlar
app.use('/api/contacts', contactsRouter);
app.use('/api/users', usersRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
