import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import User from '../db/models/user.js';
import Session from '../db/models/session.js';

export const registerUser = async (payload) => {
  const userExists = await User.findOne({ email: payload.email });
  if (userExists) {
    throw createHttpError(409, 'Email in use');
  }

  const user = await User.create(payload);
  return user;
};

export const loginUser = async (payload) => {
  console.log('Login isteği alındı, e-posta:', payload.email); // Başlangıçta
  try {
    const user = await User.findOne({ email: payload.email });
    if (!user) {
      throw createHttpError(401, 'Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(payload.password, user.password);
    if (!passwordMatch) {
      throw createHttpError(401, 'Invalid credentials');
    }

    const oldSession = await Session.findOne({ userId: user._id });
    if (oldSession) {
      await oldSession.deleteOne();
    }

    const newSession = await createSession(user._id);
    console.log('Kullanıcı doğrulandı, oturum oluşturuluyor.'); // Başarılı girişten önce
    return { accessToken: newSession.accessToken };
  } catch (error) {
    console.error('Login sırasında hata oluştu:', error); // Hata yakalandığında
    throw error; // Hatanın yayılmasını sağla
  }
};

export const refreshSession = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const user = await User.findById(session.userId);
  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  await session.deleteOne();
  const newSession = await createSession(user._id);

  return {
    accessToken: newSession.accessToken,
    newRefreshToken: newSession.refreshToken,
  };
};

export const logoutUser = async (refreshToken) => {
  await Session.deleteOne({ refreshToken });
};

const createSession = async (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  const session = await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 dakika
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 gün
  });
  return session;
};
