import { Request } from 'express';

export interface task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  userId: string;
}

export interface user {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  tasksIds?: string[];
  tasks?: task[];
}

export interface CustomRequest extends Request {
  user?: user;
}
