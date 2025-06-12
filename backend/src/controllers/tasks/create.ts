import { Request, Response, NextFunction } from 'express';
import { ICreateTaskRequest } from '../../interfaces/tasks/request';
import { ITaskResponse } from '../../interfaces/tasks/response';
import { createTask } from '../../services/tasks/create.service';
import { ApiResponse } from '../../utils/apiResponse';

export const createTaskHandler = async (
  req: Request<{}, {}, ICreateTaskRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await createTask(req.body);
    new ApiResponse<ITaskResponse>({
      data: task,
      message: 'Task created successfully',
    }).send(res);
  } catch (error) {
    next(error);
  }
};