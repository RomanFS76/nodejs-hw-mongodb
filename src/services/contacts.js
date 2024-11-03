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

export const updateContacts = async ({_id, payload, options={}}) => {
    const data = await ContactsCollection.findOneAndUpdate({_id}, payload, {...options,new:true});

    return data;

  };
