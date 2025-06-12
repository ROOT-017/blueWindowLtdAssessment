import Joi from "joi";
import { createSchema } from "../../middleware/validator";

export interface ICreateTaskRequest {
  title: string;
  description: string;
}

export interface IUpdateTaskRequest {
  title?: string;
  description?: string;
}

export const createTaskSchema = createSchema<ICreateTaskRequest>(
  Joi.object({
    title: Joi.string().max(255).required().messages({
      "string.empty": "Title cannot be empty",
      "string.max": "Title cannot exceed 255 characters",
      "any.required": "Title is required",
    }),
    description: Joi.string().required().messages({
      "string.empty": "Description cannot be empty",
      "any.required": "Description is required",
    }),
  })
);

export const updateTaskSchema = createSchema<IUpdateTaskRequest>(
  Joi.object({
    title: Joi.string().max(255).optional().messages({
      "string.empty": "Title cannot be empty",
      "string.max": "Title cannot exceed 255 characters",
    }),
    description: Joi.string().optional().messages({
      "string.empty": "Description cannot be empty",
    }),
  }).or("title", "description") // Require at least one field to update
);

export const taskIdParamSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9]+$/) // Matches auto-increment ID
    .required()
    .messages({
      "string.pattern.base": "ID must be a numeric value",
      "any.required": "Task ID is required",
    }),
});

export type ITaskIdParam = {
  id: number;
};
