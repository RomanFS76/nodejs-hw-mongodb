import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';

import { getContacts,getContactsById } from './services/contacts.js';



const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    const data = await getContacts();
    res.json({
      status:200,
      message: "Successfully found contacts!",
      data,
    })
  });

  app.get('/contacts/:id', async (req, res) => {
    console.log(req.params)

    const {id} = req.params
    const data = await getContactsById(id);

    if(!data){
      return res.status(404).json({
        message:`Contact not found`,
      })
    }
    res.json({
      status:200,
      message: `Successfully found contact with id ${id}`,
      data,
    })
  });


  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Route not found',
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
