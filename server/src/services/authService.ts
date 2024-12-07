import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import createToken from '../utils/createToken';
import ApiError from '../utils/ApiError';

const prisma = new PrismaClient();

// @desc    Register
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response) => {
  // 1. Get user input
  const { name, email, password } = req.body;
  // 2. Validate user input (validation layer)
  // 3. Check if user already exists (database layer - validation layer)
  // 4. bcrypt the password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // 5. Save user to database
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  console.log(user);
  // 6. Generate token
  const token = createToken({ id: user.id });
  // 7. Send token in response
  res.status(201).json({ token });
});

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  // 1. Get user input
  const { email, password } = req.body;
  // 2. Validate user input (validation layer)
  // 3. Check if user exists (database layer - validation layer)
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      tasks: true,
    },
  });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }
  // 4. Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }
  // 5. Generate token
  const token = createToken({ id: user.id });
  // 6. Send token in response
  res.json({ token,tasks: user.tasks });
});
