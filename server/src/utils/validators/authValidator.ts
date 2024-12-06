import { check } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import { RequestHandler } from 'express';

const prisma = new PrismaClient();

export const registerValidator: RequestHandler[] = [
  check('name', 'Name is required').notEmpty().isLength({ min: 5, max: 50 }),
  check(
    'password',
    'Please enter a password with 6 or more characters',
  ).isLength({ min: 6, max: 20 }),
  check('email', 'Please include a valid email')
    .notEmpty()
    .isEmail()
    .custom((email) =>
      prisma.user.findFirst({ where: { email } }).then((user) => {
        if (user) {
          return Promise.reject('Email already in use');
        }
      }),
    ),

  validatorMiddleware,
];