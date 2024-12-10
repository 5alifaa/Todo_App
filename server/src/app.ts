import express from 'express';
import router from './routes/router';
import morgan from 'morgan';
import globalError from './middlewares/globalErrorMiddleware';
import ApiError from './utils/ApiError';
import cors from 'cors';

require('dotenv').config();

const app = express();

app.use(express.json({ limit: '10kb' })); // for parsing application/json, set limit to 10kb
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', router);

app.use('*', (req, _res, next) => {
  next(new ApiError(405, `Can't find ${req.originalUrl} on this server!`));
});

// Global error handler
app.use(globalError);

export default app;
