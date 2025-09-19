import createHttpError from 'http-errors';

const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    next(createHttpError(400, errorMessage));
    return;
  }

  next();
};

export default validateBody;