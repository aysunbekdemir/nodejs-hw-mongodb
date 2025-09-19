import { Types } from 'mongoose';
import createHttpError from 'http-errors';

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    return next(createHttpError(400, 'Invalid ID format'));
  }
  next();
};

export default isValidId;