import { body } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { validationMiddleware } from '../../middlewares/validatorMiddleware';

const prisma = new PrismaClient();

export const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be between 6 to 20 characters long'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .custom((email) =>
      prisma.user.findFirst({ where: { email } }).then((user) => {
        if (user) {
          return Promise.reject('Email already in use');
        }
      }),
    ),

  validationMiddleware,
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be between 6 to 20 characters long'),

  validationMiddleware,
];
