import http from "http";
import app from "./app";
import { connectDatabase } from "./config/db";
import logger from "./utils/logger";

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDatabase();

    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });

    process.on("SIGTERM", () => {
      logger.info("SIGTERM received. Shutting down gracefully");
      server.close(() => {
        logger.info("Process terminated");
      });
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
