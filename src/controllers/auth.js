import * as authService from '../services/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const registerController = async (req, res) => {
  const user = await authService.registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'User registered successfully!',
    data: {
      name: user.name,
      email: user.email,
    },
  });
};

const loginController = async (req, res) => {
  const session = await authService.loginUser(req.body);

  res.status(200).json({
    status: 200,
    message: 'User logged in successfully!',
    data: session,
  });
};

const logoutController = async (req, res) => {
  await authService.logoutUser(req.cookies.refreshToken);

  res.status(204).send();
};

const refreshController = async (req, res) => {
  const session = await authService.refreshSession(req.body.refreshToken);

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: session,
  });
};

const sendResetEmailController = async (req, res) => {
  await authService.sendResetEmail(req.body.email);

  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

const resetPasswordController = async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.password);

  res.json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};

export const register = ctrlWrapper(registerController);
export const login = ctrlWrapper(loginController);
export const logout = ctrlWrapper(logoutController);
export const refresh = ctrlWrapper(refreshController);
export const sendResetEmail = ctrlWrapper(sendResetEmailController);
export const resetPassword = ctrlWrapper(resetPasswordController);