import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

export default (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) return res.status(400).json({ error: error.details.map(d => d.message) });
  next();
};
