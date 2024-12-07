import { NextFunction, Request, Response } from 'express';
import { CustomRequest } from '../utils/CustomTypes';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const setUserId = (
  req: CustomRequest,
  _res: Response,
  next: NextFunction,
) => {
  req.body.userId = req.user?.id;
  next();
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req: Request, res: Response) => {
  res.send('Get All Tasks');
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
export const createTask = asyncHandler(async (req: Request, res: Response) => {
  // 1. Get user input
  const { title, userId } = req.body;
  // 2. Validate user input (validation layer)
  // 3. Save task to database
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      tasks: {
        create: {
          title,
        },
      },
    },
    include: {
      tasks: true,
    },
  });
  const data = { tasks: user.tasks.reverse() };
  // 4. Send response
  res.status(201).json({
    status: 'success',
    result: user.tasks.length,
    data: user.tasks,
  });
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  res.send('Update a Task');
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  res.send('Delete a Task');
});
