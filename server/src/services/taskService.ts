import { Request, Response } from 'express';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
export const getTasks = async (req: Request, res: Response) => {
  res.send("Get All Tasks");
} 

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req: Request, res: Response) => {
  res.send("Create a Task");
}

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req: Request, res: Response) => {
  res.send("Update a Task");
}

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req: Request, res: Response) => {
  res.send("Delete a Task");
}