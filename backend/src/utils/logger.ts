// import winston from 'winston';
import { TransformableInfo } from 'logform';
import DailyRotateFile from 'winston-daily-rotate-file';
import { Request, Response } from 'express';
import { inspect } from 'util';
import { v4 as uuidv4 } from 'uuid';
import config from '../config';
import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom format that handles error objects
const errorStackFormat = winston.format((info) => {
  if (info instanceof Error) {
    return {
      ...info,
      stack: info.stack,
      message: info.message
    };
  }
  if (info.error instanceof Error) {
    return {
      ...info,
      stack: info.error.stack,
      message: `${info.message}\n${info.error.message}`
    };
  }
  return info;
});

// Custom print function for log format
const customFormat = printf(({ level, message, timestamp, stack, correlationId, ...meta }: TransformableInfo) => {
  let log = `${timestamp} [${level}]`;
  if (correlationId) log += ` [${correlationId}]`;
  log += `: ${message}`;

  if (stack) {
    log += `\n${stack}`;
  }

  if (Object.keys(meta).length > 0) {
    log += `\n${inspect(meta, { colors: true, depth: 5, compact: false })}`;
  }

  return log;
});

// Transport for rotating error logs
const errorTransport = new DailyRotateFile({
  level: 'error',
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  format: combine(
    errorStackFormat(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat
  )
});

// Transport for rotating combined logs
const combinedTransport = new DailyRotateFile({
  filename: 'logs/combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  format: combine(
    errorStackFormat(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat
  )
});

// Console transport for development
const consoleTransport = new winston.transports.Console({
  level: config.env === 'development' ? 'debug' : 'info',
  format: combine(
    colorize(),
    errorStackFormat(),
    timestamp({ format: 'HH:mm:ss' }),
    customFormat
  )
});

// Main logger instance
const logger = winston.createLogger({
  level: 'info',
  defaultMeta: { service: 'task-manager-api' },
  transports: [consoleTransport],
  exitOnError: false
});

// Add file transports in production
if (config.env === 'production') {
  logger.add(errorTransport);
  logger.add(combinedTransport);
}

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: () => void) => {
  const correlationId = req.headers['x-correlation-id'] || uuidv4();
  req.logger = logger.child({ correlationId });

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl, body, query, params } = req;
    const { statusCode } = res;

    const meta = {
      method,
      url: originalUrl,
      statusCode,
      duration: `${duration}ms`,
      query,
      params,
      // Don't log sensitive data
      body: config.env === 'development' ? body : '[REDACTED]'
    };

    if (statusCode >= 400) {
      req.logger.error(`${method} ${originalUrl} - ${statusCode}`, meta);
    } else {
      req.logger.info(`${method} ${originalUrl} - ${statusCode}`, meta);
    }
  });

  next();
};

// Logger utility methods
export const log = {
  info: (message: string, meta?: Record<string, unknown>) => logger.info(message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => logger.warn(message, meta),
  error: (message: string, error?: Error, meta?: Record<string, unknown>) => {
    if (error) {
      logger.error(`${message} - ${error.message}`, { ...meta, error });
    } else {
      logger.error(message, meta);
    }
  },
  debug: (message: string, meta?: Record<string, unknown>) => logger.debug(message, meta),
  http: (message: string, meta?: Record<string, unknown>) => logger.http(message, meta),
  verbose: (message: string, meta?: Record<string, unknown>) => logger.verbose(message, meta),
  silly: (message: string, meta?: Record<string, unknown>) => logger.silly(message, meta),
};

// Type augmentation for Express Request
declare global {
  namespace Express {
    interface Request {
      logger: winston.Logger;
    }
  }
}

export default logger;