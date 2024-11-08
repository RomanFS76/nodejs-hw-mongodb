import { Schema, model } from 'mongoose';
import { contactTypeList } from '../../constants/contacts.js';
import { handleSaveError, setUpdateSettings } from './hooks.js';

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: contactTypeList,
      required: true,
      default: 'personal',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const sortByList = ['name', 'phoneNumber',"email"];

contactsSchema.post('save', handleSaveError);
contactsSchema.pre('findOneAndUpdate', setUpdateSettings);
contactsSchema.post('findOneAndUpdate', handleSaveError);

export const ContactsCollection = model('contacts', contactsSchema);
