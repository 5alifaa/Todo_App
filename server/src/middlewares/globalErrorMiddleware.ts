import ApiError from '../utils/ApiError';
import { Request, Response,NextFunction } from 'express';

const sendErrorDev = (err: ApiError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err.error,
    stack: err.stack,
  });
};

const sendErrorProd = (err: ApiError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalError = (err: ApiError, req: Request, res: Response, next: NextFunction) => {

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.log('Node Env: ', process.env.NODE_ENV);

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
};

export default globalError;
