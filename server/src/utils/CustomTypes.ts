import { Request } from 'express';

export interface CustomRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    // optional tasks property
    tasks?: {
      id: string;
      title: string;
      completed: boolean;
      createdAt: Date;
    }[];
  };
}

