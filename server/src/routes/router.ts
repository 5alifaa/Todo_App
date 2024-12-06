import express from 'express';
import authRouter from './authRouter';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('router.ts');
});

router.use('/auth', authRouter);

export default router;
