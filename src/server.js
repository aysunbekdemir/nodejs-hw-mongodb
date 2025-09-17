import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './utils/env.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { authRouter } from './routers/auth.js';
import { contactsRouter } from './routers/contacts.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import path from 'node:path';

const bootstrap = async () => {
  await initMongoConnection();

  const app = express();

  app.use(pino({ transport: { target: 'pino-pretty' } }));
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());

  const swaggerDocsPath = path.join(process.cwd(), 'docs', 'swagger.json');
  try {
    const swaggerFile = fs.readFileSync(swaggerDocsPath, 'utf8');
    const swaggerDocs = JSON.parse(swaggerFile);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  } catch (err) {
    console.error('Failed to load Swagger docs, run "npm run build-docs"', err);
  }

  app.use('/api/auth', authRouter);
  app.use('/api/contacts', contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  const PORT = env('PORT', 4000);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});