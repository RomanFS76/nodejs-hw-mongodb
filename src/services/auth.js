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
import { SMTP } from '../constants/index.js';

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

  return UserCollection.create({ ...payload, password: hashPassword });
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

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to: 'jenziel.dierks@feesites.com',
    subject: 'Reset your password',
    html: `<p>Click <a https://http://localhost:3000/auth/reset-password?token=<jwt-token>>here</a> to reset your password!</p>`,
  });
};

export const findSession = (filter) => SessionCollection.findOne(filter);

export const findUser = (filter) => UserCollection.findOne(filter);

// {
//     "name": "Povalenko023132",
//     "phoneNumber": "+38000043545000005"
// }

// {
//     "email": "R@gmail.com",
//     "password": "112233"
// }

// {
//   "name": "Vova",
//   "email": "VovaR@gmail.com",
//   "password": "123456789"
// }


// jenziel.dierks@feesites.com

// {
//   "name": "88899",
//   "email": "jenziel.dierks@feesites.com",
//   "password": "123456789"
// }


