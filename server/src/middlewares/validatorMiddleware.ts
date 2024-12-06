import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// @desc    Middleware to find validation errors
const validatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void | Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

export default validatorMiddleware;
