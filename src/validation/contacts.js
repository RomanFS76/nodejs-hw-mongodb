import Joi from "joi";
import { contactTypeList } from "../constants/contacts.js";

export const addContactsSchema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        "any.required":`Fill name must be filled!`
    }),
    phoneNumber: Joi.string().min(3).max(30).required().messages({
        "any.required":`Fill phoneNumber must be filled!`
    }),
    email: Joi.string().min(3).max(30),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().min(3).max(30).valid(...contactTypeList),
});

export const updateContactsSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    phoneNumber: Joi.string().min(3).max(30),
    email: Joi.string().min(3).max(30),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().min(3).max(30).valid(...contactTypeList),
});
