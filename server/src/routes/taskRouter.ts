import { Router } from 'express';
import { protect } from '../services/authService';
import { createTask, getTasks, setUserId } from '../services/taskService';
import {
  createTaskValidator,
  getTasksValidator,
} from '../utils/validators/taskValidator';

const taskRouter = Router();

// Protect All Routes of Task Router
taskRouter.use(protect);

// Set User ID Middleware
taskRouter.use(setUserId);

taskRouter
  .route('/')
  .get(getTasksValidator, getTasks)
  .post(createTaskValidator, createTask);

taskRouter.route('/:id').put().delete();

export default taskRouter;
