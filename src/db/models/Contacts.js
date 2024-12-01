import { Schema, SchemaType, model } from 'mongoose';
import { contactTypeList } from '../../constants/contacts.js';
import { handleSaveError, setUpdateSettings } from './hooks.js';

const contactsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
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
    photo:{
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

contactsSchema.post('save', handleSaveError);
contactsSchema.pre('findOneAndUpdate', setUpdateSettings);
contactsSchema.post('findOneAndUpdate', handleSaveError);

export const ContactsCollection = model('contacts', contactsSchema);
export const sortByList = ['name', 'phoneNumber', 'email'];
