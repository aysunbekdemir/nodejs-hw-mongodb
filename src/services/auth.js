import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import nodemailer from 'nodemailer'; // nodemailer import'u eklendi
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

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
};

export const refreshSession = async (currentRefreshToken) => {
  const session = await Session.findOne({ refreshToken: currentRefreshToken });
  if (!session || session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Invalid or expired refresh token');
  }

  await Session.deleteMany({ userId: session.userId });

  const newAccessToken = jwt.sign({ id: session.userId }, env('JWT_SECRET'), { expiresIn: '15m' });
  const newRefreshToken = jwt.sign({ id: session.userId }, env('JWT_SECRET'), { expiresIn: '30d' });

  await Session.create({
    userId: session.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logoutUser = (refreshToken) => {
  return Session.deleteOne({ refreshToken });
};

export const sendResetEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = jwt.sign({ email, sub: user._id }, env('JWT_SECRET'), {
    expiresIn: '5m',
  });

  const transporter = nodemailer.createTransport({
    host: env('SMTP_HOST'),
    port: env('SMTP_PORT'),
    auth: {
      user: env('SMTP_USER'),
      pass: env('SMTP_PASSWORD'),
    },
  });

  const resetLink = `${env('APP_DOMAIN')}/reset-password?token=${token}`;

  try {
    await transporter.sendMail({
      from: env('SMTP_FROM'),
      to: email,
      subject: 'Password Reset',
      html: `<p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }

  return { message: 'Reset password email has been successfully sent.' };
};

export const resetPassword = async (token, password) => {
  let decoded;
  try {
    decoded = jwt.verify(token, env('JWT_SECRET'));
  } catch (err) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await User.findOne({ email: decoded.email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.updateOne({ _id: user._id }, { password: hashedPassword });

  await Session.deleteMany({ userId: user._id });

  return { message: 'Password has been successfully reset.' };
};