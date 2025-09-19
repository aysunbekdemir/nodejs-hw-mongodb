import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import Session from '../db/models/session.js';

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(createHttpError(401, 'Authorization header is missing'));
  }

  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Invalid authorization format'));
  }

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const session = await Session.findOne({ accessToken: token });
    if (!session) {
      return next(createHttpError(401, 'Session not found'));
    }
    req.user = { userId: session.userId };
    next();
  } catch (error) {
    return next(createHttpError(401, 'Token is invalid or expired'));
  }
};

export default authenticate;