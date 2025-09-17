import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../db/models/User.js';
import { env } from '../utils/env.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return next(createHttpError(401, 'Authorization header missing'));
  }

  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Invalid authorization header'));
  }

  try {
    const { id } = jwt.verify(token, env('JWT_SECRET'));
    const user = await User.findById(id);
    if (!user) {
      return next(createHttpError(401, 'Not authorized'));
    }
    req.user = user;
    next();
  } catch (error) {
    next(createHttpError(401, 'Not authorized'));
  }
};