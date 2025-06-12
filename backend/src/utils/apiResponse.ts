import { Response } from "express";
import httpStatus from "http-status";
import { log, requestLogger as logger } from "./logger";
import { IPagination } from "../types";

export class ApiResponse<T> {
  /**
   * Creates an APIResponse instance
   * @param options Response configuration
   */
  constructor(
    private options: {
      data?: T;
      pagination?: IPagination;
      message?: string;
      statusCode?: number;
      meta?: Record<string, unknown>;
    }
  ) {
    this.options.statusCode = options.statusCode || httpStatus.OK;
    this.options.message = options.message || "Success";
  }

  /**
   * Sends the formatted response
   * @param res Express response object
   */
  public send(res: Response): void {
    const response = {
      success: true,
      message: this.options.message,
      data: this.options.data || null,
      pagination: this.options.pagination || undefined,
      meta: this.options.meta || undefined,
      timestamp: new Date().toISOString(),
    };

    // Log successful responses in development
    // if (process.env.NODE_ENV === "development") {
    //   log.info(
    //     `API Response - ${this.options.statusCode}: ${this.options.message}`,
    //     {
    //       statusCode: this.options.statusCode,
    //       response: this.options.data
    //         ? "[DATA REDACTED IN LOGS]"
    //         : "No data in response",
    //     }
    //   );
    // }

    res.status(this.options.statusCode!).json(response);
  }

  /**
   * Static method for paginated responses
   * @param res Express response object
   * @param data The paginated data
   * @param pagination Pagination metadata
   * @param message Optional message
   */
  public static sendPaginated<T>(
    res: Response,
    data: T[],
    pagination: IPagination,
    message?: string
  ): void {
    new ApiResponse({
      data: data as unknown as T,
      message: message || "Paginated results",
      meta: {
        pagination: {
          ...pagination,
          hasNextPage: pagination.page < pagination.totalPages,
          hasPreviousPage: pagination.page > 1,
        },
      },
    }).send(res);
  }

  /**
   * Static method for empty success responses
   * @param res Express response object
   * @param message Optional message
   */
  public static sendEmpty(res: Response, message?: string): void {
    new ApiResponse({
      message: message || "Operation successful",
      statusCode: httpStatus.NO_CONTENT,
    }).send(res);
  }
}

/**
 * Standardized API response format for error responses
 */
export class ApiError extends Error {
  /**
   * Creates an ApiError instance
   * @param statusCode HTTP status code
   * @param message Error message
   * @param errorCode Application-specific error code
   * @param details Additional error details
   */
  constructor(
    public statusCode: number,
    public message: string,
    public errorCode?: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Converts the error to a standardized response format
   */
  public toResponse() {
    return {
      success: false,
      message: this.message,
      errorCode: this.errorCode,
      statusCode: this.statusCode,
      details: this.details || undefined,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Type for paginated response metadata
 */
export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/**
 * Interface for standard API response
 */
export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    pagination?: PaginationMeta;
    [key: string]: unknown;
  };
  timestamp: string;
}

/**
 * Interface for error API response
 */
export interface IApiErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
  statusCode: number;
  details?: Record<string, unknown>;
  timestamp: string;
}
