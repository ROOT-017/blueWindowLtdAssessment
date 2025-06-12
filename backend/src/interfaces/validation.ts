import Joi from 'joi';

export interface IValidationErrorDetail {
  message: string;
  path: string;
  type: string;
}

export interface IValidationResult<T> {
  error?: {
    details: IValidationErrorDetail[];
  };
  value: T;
}

export type ValidationSchema<T> = Joi.ObjectSchema<T> | Joi.Schema<T>;