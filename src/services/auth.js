import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

import SessionCollection from '../db/models/Session.js';
import UserCollection from '../db/models/User.js';

import { randomBytes } from 'crypto';
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/user.js';
import { sendEmail } from '../utils/sendMail.js';
import { env } from '../utils/env.js';
import { SMTP, TEMPLATE_DIR } from '../constants/index.js';
import handlebars from 'handlebars';

import * as path from 'node:path';
import * as fs from 'node:fs/promises';

import jwt from 'jsonwebtoken';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + accessTokenLifeTime,
    refreshTokenValidUntil: Date.now() + refreshTokenLifeTime,
  };
};

export const register = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email already in use');
  }
  const hashPassword = await bcrypt.hash(password, 10);
  console.log(hashPassword);

  const newUser = await UserCollection.create({
    ...payload,
    password: hashPassword,
  });

  return newUser;
};

export const login = async ({ email, password }) => {
  const user = await UserCollection.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password invalid');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const newSession = createSession();

  return SessionCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (Date.now() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionCollection.deleteOne({ _id: session._id });

  const newSession = createSession();

  return SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logout = (sessionId) =>
  SessionCollection.deleteOne({ _id: sessionId });

// ---------------------------requestResetToken--------------------------------------------

const emailTemplatePath = path.join(TEMPLATE_DIR, 'reset-password.html');
const jwtSecret = env('JWT_SECRET');
const appDomain = env('APP_DOMAIN');

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  console.log(user);
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const token = jwt.sign({ sub: user._id, email }, jwtSecret, {
    expiresIn: '5m',
  });

  console.log(token);

  const templateSource = await fs.readFile(emailTemplatePath, 'utf8');

  const template = handlebars.compile(templateSource);

  const html = template({
    link: `${appDomain}/reset-password?token=${token}`,
  });


  await sendEmail({
    to: email,
    subject: 'Reset password',
    html,
  });
  // try {

  // } catch (error) {
  //   throw createHttpError(
  //     500,
  //     'Failed to send the email, please try again later.',
  //   );
  // }
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error)
      throw createHttpError(401, 'Token is expired or invalid.');
    throw err;
  }

  const user = await UserCollection.findOne({
    _id: entries.sub,
    email: entries.email,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UserCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );

  await SessionCollection.deleteOne({ userId: user._id });
};

export const findSession = (filter) => SessionCollection.findOne( filter );

export const findUser = (filter) => UserCollection.findOne( filter );

// {
//   "name": "88899",
//   "email": "pevivon420@cashbn.com",
//   "password": "123456789"
// }

// ukr
// mail
// LYsyf4pd9rMcWOVi

// {

//   "email": "pevivon420@cashbn.com",
//   "password": "112233"
// }
