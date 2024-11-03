import { ContactsCollection } from '../db/models/Contacts.js';

export const getContacts = () => ContactsCollection.find();
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
