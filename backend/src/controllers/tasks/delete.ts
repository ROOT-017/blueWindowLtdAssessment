import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { deleteTask } from "../../services/tasks/delete.service";
import { ApiResponse } from "../../utils/apiResponse";
import { ApiError } from "../../utils/apiError";

export const deleteTaskHandler = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    await deleteTask(parseInt(id));

    new ApiResponse<null>({
      statusCode: httpStatus.NO_CONTENT,
      message: "Task deleted successfully",
    }).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    next(
      new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to delete task")
    );
  }
};
