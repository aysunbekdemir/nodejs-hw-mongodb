import { Router } from 'express';
import validateBody from '../middlewares/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema,
  sendResetEmailSchema,
  resetPasswordSchema,
} from '../schemas/users.js';
import {
  registerUser,
  loginUser,
  sendResetEmail,
  resetPassword,
} from '../services/auth.js';
import createHttpError from 'http-errors';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  async (req, res, next) => {
    try {
      const user = await registerUser(req.body);
      res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: user,
      });
    } catch (error) {
      next(createHttpError(500, 'User with this email already exists.'));
    }
  },
);

authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  async (req, res, next) => {
    try {
      const { accessToken } = await loginUser(req.body);
      res.status(200).json({
        status: 200,
        message: 'Successfully logged in!',
        data: { accessToken },
      });
    } catch (error) {
      next(createHttpError(401, 'Invalid credentials.'));
    }
  },
);

authRouter.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema),
  async (req, res, next) => {
    try {
      await sendResetEmail(req.body.email);
      res.status(200).json({
        status: 200,
        message: 'Reset password email has been successfully sent.',
        data: {},
      });
    } catch (error) {
      if (error.message === 'User not found!') {
        next(createHttpError(404, 'User not found!'));
      } else {
        next(
          createHttpError(
            500,
            'Failed to send the email, please try again later.',
          ),
        );
      }
    }
  },
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  async (req, res, next) => {
    try {
      const { token, password } = req.body;
      await resetPassword(token, password);
      res.status(200).json({
        status: 200,
        message: 'Password has been successfully reset.',
        data: {},
      });
    } catch (error) {
      if (error.message === 'Token is expired or invalid.') {
        next(createHttpError(401, 'Token is expired or invalid.'));
      } else {
        next(createHttpError(404, 'User not found!'));
      }
    }
  },
);

export default authRouter;
