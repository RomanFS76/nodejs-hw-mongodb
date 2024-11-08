import {
  addContacts,
  deleteContacts,
  getContacts,
  getContactsById,
  updateContacts,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parseSortParams } from '../utils/parseSortParams.js';
import {sortByList} from "../db/models/Contacts.js"


import { parsePaginationParams } from '../utils/parsePaginationParams.js';

export const getContactsController = async (req, res, next) => {
  const {page,perPage} = parsePaginationParams(req.query);
  console.log(page)
  console.log(perPage)
  const {sortBy, sortOrder} = parseSortParams(req.query, sortByList);
  const data = await getContacts(page,perPage);
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data
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
    message: `Successfully created a contact!`,
    data,
  });
};

export const deleteContactsController = async (req, res) => {
  const { id: _id } = req.params;
  const result = await deleteContacts({ _id });

  if (!result) {
    throw createHttpError(404, `Contact id=${_id} not found`);
  }

  res.status(204).send();
};

export const upsertContactsController = async (req, res) => {
  const { id: _id } = req.params;
  const payload = req.body;
  const result = await updateContacts({
    _id,
    payload,
    options: { upsert: true },
  });

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted`,
    data: result.data,
  });
};

export const updateContactsController = async (req, res) => {
  const { id: _id } = req.params;
  const payload = req.body;
  const result = await updateContacts({
    _id,
    payload,
  });

  if (!result) {
    throw createHttpError(404, `Contact id=${_id} not found`);
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data:result.data,
  });
};
