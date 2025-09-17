import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import createHttpError from 'http-errors';

const createSession = () => {
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    refreshTokenValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  };
};

export const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (user) {
    return null;
  }
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  return await User.create({
    ...payload,
    password: hashedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Email or password invalid');
  }

  await Session.deleteOne({ userId: user._id });

  const sessionData = createSession();

  const session = await Session.create({
    userId: user._id,
    ...sessionData,
  });

  return {
    accessToken: session.accessToken,
    session,
  };
};

export const logoutUser = async (refreshToken) => {
  await Session.deleteOne({ refreshToken });
};

export const refreshSession = async ({ refreshToken }) => {
  const session = await Session.findOne({ refreshToken });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isTokenExpired) {
    throw createHttpError(401, 'Refresh token is expired');
  }

  await Session.deleteOne({ _id: session._id });

  const newAccessToken = crypto.randomBytes(30).toString('base64');
  const newRefreshToken = crypto.randomBytes(30).toString('base64');

  const newSession = await Session.create({
    userId: session.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    session: newSession,
    accessToken: newAccessToken,
  };
};