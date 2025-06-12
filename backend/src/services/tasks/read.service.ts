import httpStatus from "http-status";
import { Task } from "../../models/Task";
import { ITaskResponse } from "../../interfaces/tasks/response";
import { ApiError } from "../../utils/apiResponse";
import { IPagination } from "../../types";

export const readTask = async (id: number): Promise<ITaskResponse> => {
  try {
    // Find task by ID
    const task = await Task.findOne({ id: id });

    if (!task) {
      throw new ApiError(httpStatus.NOT_FOUND, "Task not found");
    }

    // Transform to response format
    const response: ITaskResponse = {
      id: task.id,
      title: task.title,
      description: task.description,
      created_at: task.created_at,
      updated_at: task.updated_at,
    };

    return response;
  } catch (error) {
    // Handle known errors
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle unexpected errors
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to fetch task"
    );
  }
};

export const readAllTasks = async (
  page: number = 1,
  limit: number = 10
): Promise<{ tasks: ITaskResponse[] } & IPagination> => {
  try {
    const skip = (page - 1) * limit;

    // Fetch tasks with pagination
    const tasks = await Task.find()
      .skip(skip)
      .limit(limit)
      .sort({ created_at: -1 });

    // Count total tasks
    const total = await Task.countDocuments();

    // Transform to response format
    const responseTasks: ITaskResponse[] = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      created_at: task.created_at,
      updated_at: task.updated_at,
    }));

    return {
      tasks: responseTasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to fetch tasks"
    );
  }
};
