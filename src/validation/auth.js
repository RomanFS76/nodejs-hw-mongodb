import Joi from 'joi';
import { emailRegex } from '../constants/user.js';

export const registerUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});
