import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
} from '../services/auth.js';
import createHttpError from 'http-errors';

export const registerUserController = async (req, res) => {
  const { email } = req.body;
  const user = await registerUser(req.body);

  if (!user) {
    throw createHttpError(409, `User with email ${email} already exists`);
  }

  res.status(201).json({
    status: 201,
    message: 'User registered successfully',
    data: {
      name: user.name,
      email: user.email,
    },
  });
};

export const loginUserController = async (req, res) => {
  const { session, accessToken } = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.json({
    status: 200,
    message: 'User logged in successfully',
    data: {
      accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token is missing');
  }

  await logoutUser(req.cookies.refreshToken);

  res.clearCookie('refreshToken');
  res.status(204).send();
};

export const refreshSessionController = async (req, res) => {
  const { session, accessToken } = await refreshSession(req.cookies);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken,
    },
  });
};