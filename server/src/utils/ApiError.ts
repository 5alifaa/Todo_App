// @desc: Custom error class for handilne API errors
class ApiError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  error: string | undefined;

  constructor(statusCode: number, message: string | undefined) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    console.log('ApiError: ', message);
  }
}
export default ApiError;