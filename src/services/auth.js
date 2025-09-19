import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

import User from '../db/models/user.js';
import Session from '../db/models/session.js';
import sendMail from './sendMail.js';

export const registerUser = async (payload) => {
  const userExists = await User.findOne({ email: payload.email });
  if (userExists) {
    throw createHttpError(409, 'Email already exists');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const newUser = await User.create({
    ...payload,
    password: hashedPassword,
  });

  return newUser;
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const passwordMatch = await bcrypt.compare(payload.password, user.password);
  if (!passwordMatch) {
    throw createHttpError(401, 'Invalid credentials');
  }

  await Session.deleteOne({ userId: user._id });

  const accessToken = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );

  const newSession = await Session.create({
    userId: user._id,
    accessToken,
  });

  return { accessToken: newSession.accessToken };
};

export const sendResetEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  try {
    await sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Password Reset',
      html: `<p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
    });
  } catch (error) {
    console.error('Nodemailer Hata Detayı:', error);
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};

export const resetPassword = async (token, newPassword) => {
  let email;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    email = decoded.email;
  } catch (error) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  await Session.deleteMany({ userId: user._id });
};
