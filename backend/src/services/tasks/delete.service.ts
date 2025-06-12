import httpStatus from "http-status";
import { Task } from "../../models/Task";
import { ApiError } from "../../utils/apiResponse";

export const deleteTask = async (id: number): Promise<void> => {
  try {
    const deletedTask = await Task.findOneAndDelete({ id: id }).exec();

    if (!deletedTask) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
    }
    return null
    
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to delete task');
  }
};
