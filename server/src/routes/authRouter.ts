import express from 'express';
import { register } from '../services/authService';
import { registerValidator } from '../utils/validators/authValidator';

const router = express.Router();  // this router will be mounted at /api/auth

router.post('/register',registerValidator, register);

export default router;