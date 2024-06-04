import Joi from "joi";

export const AccountCreationValidationRule = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(7),
  username: Joi.string().required(),
});

export const LoginValidationRule = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(7),
});
