import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { ApiError } from "../utils/apiError";
import logger from "../utils/logger";

export const validate = (schema: {
  body?: Joi.Schema;
  params?: Joi.Schema;
  query?: Joi.Schema;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationOptions = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    const { error, value } = Joi.object(schema).validate(
      {
        body: req.body,
        params: req.params,
        query: req.query,
      },
      validationOptions
    );

    if (error) {
      const errorDetails = error.details.map((detail) => ({
        message: detail.message,
        path: detail.path.join("."),
        type: detail.type,
      }));

      logger.debug("Validation failed", { errors: errorDetails });

      return next(
        ApiError.badRequest("Validation failed", {
          errors: errorDetails,
        })
      );
    }

    // Replace request properties with validated values
    req.body = value.body || req.body;
    req.params = value.params || req.params;
    // req.query = value.query || req.query;

    next();
  };
};

/**
 * Common Joi validation schemas
 */
export const validationSchemas = {
  idParam: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.pattern.base": "Invalid ID format",
        "any.required": "ID is required",
      }),
  }),
  paginationQuery: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().pattern(/^[a-zA-Z0-9_]+(?:,[a-zA-Z0-9_]+)*$/),
  }),
};

export const createSchema = <T>(schema: Joi.Schema) => {
  return schema as Joi.Schema<T>;
};
