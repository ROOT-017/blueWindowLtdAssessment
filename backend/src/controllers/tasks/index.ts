import { createTaskHandler } from "./create";
import { updateTaskHandler } from "./update";
import { deleteTaskHandler } from "./delete";
import { readTaskHandler, readAllTasksHandler } from "./read";

export default {
  create: createTaskHandler,
  delete: deleteTaskHandler,
  read: readTaskHandler,
  update: updateTaskHandler,
  readAll: readAllTasksHandler,
};
