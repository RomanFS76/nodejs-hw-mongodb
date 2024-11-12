import { userCollection } from '../db/models/User.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import SessionCollection from '../db/models/Session.js';
import {randomBytes} from 'crypto';
import { accessTokenLifeTime, refreshTokenLifeTime } from '../constants/user.js';

export const register = async (payload) => {
  const { email, password } = payload;
  const user = await userCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email already in use');
  }
  const hashPassword = await bcrypt.hash(password, 10);
  console.log(hashPassword);

  return userCollection.create({ ...payload, password: hashPassword });
};

export const login = async ({ email, password }) => {
  const user = await userCollection.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password invalid');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + accessTokenLifeTime,
    refreshTokenValidUntil: Date.now() + refreshTokenLifeTime,
  });
};
