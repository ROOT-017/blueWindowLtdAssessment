import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiResponse } from '../../utils/apiResponse';
import { updateTask } from '../../services/tasks/update.service';
import { IUpdateTaskRequest } from '../../interfaces/tasks/request';
import httpStatus from 'http-status';

export const updateTaskHandler = async (
  req: Request<{ id: string }, {}, IUpdateTaskRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id);

    if (isNaN(numericId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid task ID format');
    }

    const updatedTask = await updateTask(numericId, req.body);

    new ApiResponse({
      data: updatedTask,
      message: 'Task updated successfully'
    }).send(res);
  } catch (error) {
    next(error);
  }
};