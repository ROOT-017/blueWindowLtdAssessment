import { Task } from "../../models/Task";
import { ApiError } from "../../utils/apiError";
import { IUpdateTaskRequest } from "../../interfaces/tasks/request";
import { ITaskResponse } from "../../interfaces/tasks/response";
import httpStatus from "http-status";

export const updateTask = async (
  id: number,
  updateData: IUpdateTaskRequest
): Promise<ITaskResponse> => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { id },
      {
        ...updateData,
        updated_at: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      throw new ApiError(httpStatus.NOT_FOUND, "Task not found");
    }

    return {
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description,
      created_at: updatedTask.created_at,
      updated_at: updatedTask.updated_at,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update task",
    );
  }
};
