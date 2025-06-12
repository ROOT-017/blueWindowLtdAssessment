import httpStatus from "http-status";
import { Task } from "../../models/Task";
import { ICreateTaskRequest } from "../../interfaces/tasks/request";
import { ITaskResponse } from "../../interfaces/tasks/response";
import { ApiError } from "../../utils/apiResponse";

export const createTask = async (
  taskData: ICreateTaskRequest
): Promise<ITaskResponse> => {
  try {
    const task = new Task(taskData);
    await task.save();
    return task.toObject();
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Task with similar details already exists"
      );
    }
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create task"
    );
  }
};
