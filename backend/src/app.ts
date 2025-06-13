import express, { Application } from "express";
import morgan from "morgan";
import { requestLogger } from "./utils/logger";
import taskRouter from "./routes/tasks";
import cors from "cors";
import helmet from "helmet";

const app: Application = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(helmet());

app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

app.use(requestLogger);
process.env.NODE_ENV !== "production" && app.use(morgan("dev"));
app.use(express.json());

app.use("/api/tasks", taskRouter);

export default app;
