import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import Session from '../db/models/session.js';
import User from '../db/models/user.js';

const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer' || !token) {
    next(createHttpError(401, 'Unauthorized'));
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const session = await Session.findOne({ accessToken: token });

    if (!session || session.accessTokenValidUntil < new Date()) {
      next(createHttpError(401, 'Access token expired'));
      return;
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      next(createHttpError(401, 'User not found'));
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    next(createHttpError(401, 'Access token expired'));
  }
};

export default authenticate;