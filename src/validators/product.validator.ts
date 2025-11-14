import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  description: Joi.string().allow('').max(2000),
  price: Joi.number().positive().required(),
  category: Joi.string().optional(),
  stock: Joi.number().integer().min(0).optional(),
  ownerId: Joi.string().optional()
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(1).max(200).optional(),
  description: Joi.string().allow('').max(2000).optional(),
  price: Joi.number().positive().optional(),
  category: Joi.string().optional(),
  stock: Joi.number().integer().min(0).optional()
});
