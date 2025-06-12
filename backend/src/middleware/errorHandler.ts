import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import logger from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    logger.error(`API Error - ${err.statusCode}: ${err.message}`);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorCode: err.errorCode,
    });
  }

  logger.error(`Unhandled Error - ${err.stack}`);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};