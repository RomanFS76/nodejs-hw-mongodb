import express from 'express';
import cors from 'cors';

import { env } from './utils/env.js';

import routerContacts from './routers/contacts.js';
import authRouter from './routers/auth.js';

import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

import { logger } from './middlewares/logger.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(cors());

  app.use(express.json());
  app.use(cookieParser());

  // app.use(logger);

  app.use('/auth', authRouter);
  app.use('/contacts', routerContacts);
  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
