import express from 'express';
import authRouter from './authRouter';
import taskRouter from './taskRouter';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('router.ts');
});

router.use('/auth', authRouter);
router.use('/tasks', taskRouter);

export default router;
