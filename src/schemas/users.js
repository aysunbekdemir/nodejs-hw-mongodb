import Joi from 'joi';

const registerUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const sendResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export { registerUserSchema, loginUserSchema, sendResetEmailSchema };