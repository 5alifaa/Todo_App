import jwt from 'jsonwebtoken';
import ApiError from './ApiError';

const createToken = (payload:object) => {
  if (!process.env.JWT_SECRET) {
    throw new ApiError(500, 'JWT_SECRET is missing');
  }
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

export default createToken;