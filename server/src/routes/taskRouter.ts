import { Router } from 'express';
import { protect } from '../services/authService';
import {
  createTask,
  deleteAllTasks,
  deleteTask,
  getTasks,
  setUserId,
  updateTask,
} from '../services/taskService';
import {
  createTaskValidator,
  deleteTaskValidator,
  getTasksValidator,
  updateTaskValidator,
} from '../utils/validators/taskValidator';

const taskRouter = Router();

// Protect All Routes of Task Router
taskRouter.use(protect);

// Set User ID Middleware
taskRouter.use(setUserId);

taskRouter
  .route('/')
  .get(getTasksValidator, getTasks)
  .post(createTaskValidator, createTask)
  .delete(deleteAllTasks);

taskRouter
  .route('/:id')
  .put(updateTaskValidator, updateTask)
  .delete(deleteTaskValidator, deleteTask);

export default taskRouter;
