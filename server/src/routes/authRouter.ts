import express from 'express';
import { login, register } from '../services/authService';
import {
  loginValidator,
  registerValidator,
} from '../utils/validators/authValidator';

const router = express.Router(); // this router will be mounted at /api/auth

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);

export default router;
