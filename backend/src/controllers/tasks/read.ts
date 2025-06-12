import { NextFunction, Request, Response } from "express";
import { readAllTasks, readTask } from "../../services/tasks/read.service";
import { ApiResponse } from "../../utils/apiResponse";
import { ITaskResponse } from "../../interfaces/tasks/response";
import { log } from "console";
import { updateTaskSchema } from "../../interfaces/tasks/request";

export const readTaskHandler = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id);

    const task = await readTask(numericId);

    new ApiResponse<ITaskResponse>({
      data: task,
      message: "Task retrieved successfully",
    }).send(res);
  } catch (error) {
    next(error);
  }
};

export const readAllTasksHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = req.query;
    const numericPage = parseInt(page as string) || 1;
    const numericLimit = parseInt(limit as string) || 10;

    const tasks = await readAllTasks(numericPage, numericLimit);
    log(tasks);
    new ApiResponse({
      data: tasks.tasks,
      pagination: { ...tasks },
      message: "Tasks retrieved successfully",
    }).send(res);
  } catch (error) {
    next(error);
  }
};
