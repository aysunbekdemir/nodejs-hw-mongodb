import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../db/models/User.js';
import { Session } from '../db/models/Session.js';
import { env } from '../utils/env.js';

export const registerUser = async (payload) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  return User.create({ ...payload, password: hashedPassword });
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const passwordMatch = await bcrypt.compare(payload.password, user.password);
  if (!passwordMatch) {
    throw createHttpError(401, 'Invalid email or password');
  }

  await Session.deleteMany({ userId: user._id });

  const accessToken = jwt.sign({ id: user._id }, env('JWT_SECRET'), { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user._id }, env('JWT_SECRET'), { expiresIn: '30d' });

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken, session };
};

export const refreshSession = async (currentRefreshToken) => {
  const session = await Session.findOne({ refreshToken: currentRefreshToken });
  if (!session || session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Invalid or expired refresh token');
  }

  await Session.deleteMany({ userId: session.userId });

  const newAccessToken = jwt.sign({ id: session.userId }, env('JWT_SECRET'), { expiresIn: '15m' });
  const newRefreshToken = jwt.sign({ id: session.userId }, env('JWT_SECRET'), { expiresIn: '30d' });

  const newSession = await Session.create({
    userId: session.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken, session: newSession };
};

export const logoutUser = (refreshToken) => {
  return Session.deleteOne({ refreshToken });
};