import { ContactsCollection } from '../db/models/Contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = async ({ page = 1, perPage = 10, sortBy  = "_id",sortOrder ="asc", contactType, isFavourite,userId }) => {


  const skip = (page - 1) * perPage;
  const query = ContactsCollection.find().skip(skip).limit(perPage).sort({[sortBy]:sortOrder});

  if(contactType){
    query.where("contactType").equals(contactType);
  }
  if (typeof isFavourite === 'boolean'){
    query.where("isFavourite").equals(isFavourite);
  }
  if (userId){
    query.where("userId").equals(userId);
  }

  const data = await query;
  const totalItems = await ContactsCollection.countDocuments();

  const paginationData = calculatePaginationData({page, perPage, totalItems});
  return {
    data,
    ...paginationData
  };
};

export const getContactsById = ({_id,userId}) => ContactsCollection.findOne({_id,userId});

export const addContacts = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const deleteContacts = async ({_id,userId}) => {
  const contact = await ContactsCollection.findOneAndDelete({_id,userId});
  return contact;
};

export const updateContacts = async ({ _id,userId, payload, options = {} }) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id },
    payload,
    {
      ...options,
      new: true,
      includeResultMetadata: true,
    },
  );
  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted),
  };
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
