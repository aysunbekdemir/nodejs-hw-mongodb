import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, {
      convert: false,
      abortEarly: false,
    });
    next();
  } catch (err) {
    const errorMessage = err.details.map((detail) => detail.message).join('; ');
    next(createHttpError(400, errorMessage));
  }
};
