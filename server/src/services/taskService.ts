import asyncHandler from 'express-async-handler';
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
export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  // 1. Get user input
  const { userId } = req.body;
  // 2. Validate user input (validation layer)
  // 3. Get tasks from database
  const tasks = await prisma.task.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  // 4. Send response
  res.status(200).json({
    result: tasks.length,
    tasks,
  });
});

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
export const createTask = asyncHandler(async (req: Request, res: Response) => {
  // 1. Get user input
  const { title, userId } = req.body;
  // 2. Validate user input (validation layer)
  // 3. Save task to database
  const task = await prisma.task.create({
    data: {
      title,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
  // 4. Send response
  res.status(201).json({
    status: 'success',
    task,
  });
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  // 1. Get user input
  const { title, completed, userId } = req.body;
  const { id } = req.params;
  // 2. Validate user input (validation layer)
  // 3. Update task in database
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      tasks: {
        update: {
          where: {
            id,
          },
          data: {
            title,
            completed,
          },
        },
      },
    },
    include: {
      tasks: true,
    },
  });
  // 4. Send response
  res.status(200).json({
    status: 'success',
    result: user.tasks.length,
    data: user.tasks,
  });
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  // 1. Get user input
  const { userId } = req.body;
  const { id } = req.params;
  // 2. Validate user input (validation layer)
  // 3. Delete task from database
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      tasks: {
        delete: {
          id,
        },
      },
    },
    include: {
      tasks: true,
    },
  });
  // 4. Send response
  res.status(200).json({
    status: 'success',
    result: user.tasks.length,
    data: user.tasks,
  });
});

// @desc    Delete all tasks
// @route   DELETE /api/tasks
// @access  Private
export const deleteAllTasks = asyncHandler(
  async (req: Request, res: Response) => {
    // 1. Get user input
    const { userId } = req.body;
    // 2. Validate user input (validation layer)
    // 3. Delete all tasks of specific user from database
    await prisma.task.deleteMany({
      where: {
        userId,
      },
    });
    // 4. Send response
    res.status(204).json();
  },
);
