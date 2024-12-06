import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

// @desc    Register
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response) => {
  res.send('register route');
});
