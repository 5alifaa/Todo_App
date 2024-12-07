import { body, check } from 'express-validator';
import validationMiddleware from '../../middlewares/validatorMiddleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTasksValidator = [
  check('userId').isMongoId().withMessage('User ID is invalid'),

  validationMiddleware,
];

export const createTaskValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 50 })
    .withMessage('Title should not exceed 50 characters'),
  body('userId').isMongoId().withMessage('User ID is invalid'),

  validationMiddleware,
];

export const updateTaskValidator = [
  check('id')
    .isMongoId()
    .withMessage('Task ID is invalid')
    .custom((value, { req }) =>
      prisma.task
        .findUnique({
          where: {
            id: value,
          },
        })
        .then((task) => {
          // check if the task exists
          if (!task) {
            return Promise.reject(new Error('Task not found'));
          }

          // check if the task belongs to the user
          if (task?.userId !== req.body.userId) {
            return Promise.reject(
              new Error('Task does not belong to the user'),
            );
          }
        }),
    ),
  check('title')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Title should not exceed 50 characters'),
  check('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed should be a boolean'),
  check('userId').notEmpty().withMessage('User ID is required'),

  validationMiddleware,
];

export const deleteTaskValidator = [
  check('id')
    .isMongoId()
    .withMessage('Task ID is invalid')
    .custom((value, { req }) => {
      prisma.task
        .findUnique({
          where: {
            id: value,
          },
        })
        .then((task) => {
          // check if the task exists
          if (!task) {
            return Promise.reject(new Error('Task not found'));
          }

          // check if the task belongs to the user
          if (task?.userId !== req.body.userId) {
            return Promise.reject(
              new Error('Task does not belong to the user'),
            );
          }
        });
    }),

  check('userId').isMongoId().withMessage('User ID is invalid'),

  validationMiddleware,
];
