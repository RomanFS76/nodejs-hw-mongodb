import {
  addContacts,
  deleteContacts,
  getContacts,
  getContactsById,
  updateContacts,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res, next) => {
  const data = await getContacts();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactsByIdController = async (req, res, next) => {
  const { id } = req.params;
  const data = await getContactsById(id);

  if (!data) {
    throw createHttpError(404, `Contact id=${id}  not found`);
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}`,
    data,
  });
};

export const addContactsController = async (req, res) => {
  const data = await addContacts(req.body);

  res.status(201).json({
    status: 201,
    message: `Successfully created a student!`,
    data,
  });
};

export const deleteContactsController = async (req, res) => {
  const { id: _id } = req.params;
  const data = await deleteContacts({ _id });

  if (!data) {
    next(createHttpError(404, `Contact id=${_id}  not found`));
  }

  res.status(204).send();
};

export const upsertContactsController = async (req, res) => {
  const { id: _id } = req.params;
  const payload = req.body;
  const data = await updateContacts({
    _id,
    payload,
    options: { upsert: true },
  });

  res.json({
    status: 200,
    message: `Successfully update id ${_id}`,
    data,
  });
};
