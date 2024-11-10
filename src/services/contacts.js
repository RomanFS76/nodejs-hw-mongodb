import { ContactsCollection } from '../db/models/Contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = async ({ page = 1, perPage = 10, sortBy  = "_id",sortOrder ="asc", contactType, isFavourite }) => {


  const skip = (page - 1) * perPage;
  const query = ContactsCollection.find().skip(skip).limit(perPage).sort({[sortBy]:sortOrder});

  if(contactType){
    query.where("contactType").equals(contactType);
  }
  if(isFavourite){
    query.where("isFavourite").equals(isFavourite);
  }

  const data = await query;
  const totalItems = await ContactsCollection.countDocuments();

  const paginationData = calculatePaginationData({page, perPage, totalItems});
  return {
    data,
    ...paginationData
  };
};

export const getContactsById = (id) => ContactsCollection.findById(id);

export const addContacts = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const deleteContacts = async (id) => {
  const contact = await ContactsCollection.findOneAndDelete(id);
  return contact;
};

export const updateContacts = async ({ _id, payload, options = {} }) => {
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
