import express, { Application } from "express";
import morgan from "morgan";
import { requestLogger } from "./utils/logger";
import taskRouter from "./routes/tasks";

const app: Application = express();

app.use(requestLogger);
process.env.NODE_ENV !== "production" && app.use(morgan("dev"));
app.use(express.json());

app.use("/api/tasks", taskRouter);

export default app;
