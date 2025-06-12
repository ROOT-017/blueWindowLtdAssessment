import httpStatus from "http-status";
import { IApiErrorResponse } from "./apiResponse";

/**
 * Custom API Error class for consistent error handling
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errorCode?: string;
  public readonly details?: Record<string, unknown>;

  constructor(
    statusCode: number,
    message: string,
    options: {
      isOperational?: boolean;
      errorCode?: string;
      details?: Record<string, unknown>;
      stack?: string;
    } = {}
  ) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = options.isOperational ?? true;
    this.errorCode = options.errorCode;
    this.details = options.details;

    if (options.stack) {
      this.stack = options.stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Convert error to standardized response format
   */
  public toResponse(): IApiErrorResponse {
    return {
      success: false,
      message: this.message,
      statusCode: this.statusCode,
      errorCode: this.errorCode,
      details: this.details,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Common error types as static methods
   */
  static badRequest(message: string, details?: Record<string, unknown>) {
    return new ApiError(httpStatus.BAD_REQUEST, message, {
      errorCode: "BAD_REQUEST",
      details,
    });
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(httpStatus.UNAUTHORIZED, message, {
      errorCode: "UNAUTHORIZED",
    });
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(httpStatus.FORBIDDEN, message, {
      errorCode: "FORBIDDEN",
    });
  }

  static notFound(message = "Resource not found") {
    return new ApiError(httpStatus.NOT_FOUND, message, {
      errorCode: "NOT_FOUND",
    });
  }

  static conflict(message = "Conflict occurred") {
    return new ApiError(httpStatus.CONFLICT, message, {
      errorCode: "CONFLICT",
    });
  }

  static internal(message = "Internal server error") {
    return new ApiError(httpStatus.INTERNAL_SERVER_ERROR, message, {
      isOperational: false,
      errorCode: "INTERNAL_ERROR",
    });
  }
}

/**
 * Type guard for ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
