import { Router } from 'express';
import { registerUser, loginUser, refreshSession, logoutUser } from '../services/auth.js';
import validateBody from '../middlewares/validateBody.js';
import { registerUserSchema, loginUserSchema } from '../schemas/users.js';

const authRouter = Router();

authRouter.post('/register', validateBody(registerUserSchema), async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: { name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/login', validateBody(loginUserSchema), async (req, res, next) => {
  try {
    const { accessToken, newRefreshToken } = await loginUser(req.body);
    if (newRefreshToken) {
      res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw createHttpError(401, 'Unauthorized');
    }
    const { accessToken, newRefreshToken } = await refreshSession(refreshToken);
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });
    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/logout', async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    await logoutUser(refreshToken);
    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default authRouter;