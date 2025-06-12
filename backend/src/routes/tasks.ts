import express from "express";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../interfaces/tasks/request";
import { validate } from "../middleware/validator";
import tasksHandler from "../controllers/tasks";

const router = express.Router();

router.post("/", validate({ body: createTaskSchema }), tasksHandler.create);
router.get("/", tasksHandler.readAll);
router.get("/:id", tasksHandler.read);
router.put("/:id", validate({ body: updateTaskSchema }), tasksHandler.update);
router.delete("/:id", tasksHandler.delete);

export default router;

