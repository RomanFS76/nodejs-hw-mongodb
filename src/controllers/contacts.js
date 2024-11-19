import {
  addContacts,
  deleteContacts,
  getContacts,
  getContactsById,
  updateContacts,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parseSortParams } from '../utils/parseSortParams.js';
import { sortByList } from '../db/models/Contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { contactType, isFavourite } = parseFilterParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);

  const{_id:userId} = req.user;


  console.log(req.user);

  const data = await getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    contactType,
    isFavourite,
    userId
  });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactsByIdController = async (req, res, next) => {
  const { id:_id } = req.params;
  const{_id:userId} = req.user;

  console.log(req.params);
  console.log(userId);

  const data = await getContactsById({_id,userId});

  if (!data) {
    throw createHttpError(404, `Contact id=${_id}  not found`);
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${_id}`,
    data,
  });
};

export const addContactsController = async (req, res) => {
  console.log(req.user);

  const { _id: userId } = req.user;

  const data = await addContacts({...req.body, userId});
  console.log(req.body);

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data,
  });
};

export const deleteContactsController = async (req, res) => {
  const { id: _id } = req.params;
  const{_id:userId} = req.user;
  const result = await deleteContacts({ _id,userId });

  if (!result) {
    throw createHttpError(404, `Contact id=${_id} not found`);
  }

  res.status(204).send();
};

export const upsertContactsController = async (req, res) => {
  const { id: _id } = req.params;
  const{_id:userId} = req.user;
  const payload = req.body;
  const result = await updateContacts({
    _id,
    userId,
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
  const{_id:userId} = req.user;
  const payload = req.body;
  const result = await updateContacts({
    _id,
    userId,
    payload,
  });

  if (!result) {
    throw createHttpError(404, `Contact id=${_id} not found`);
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.data,
  });
};
