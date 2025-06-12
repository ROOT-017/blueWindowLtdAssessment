import mongoose from "mongoose";
import logger from "../utils/logger";
import { log } from "console";



const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

if (!DB_URL || !DB_NAME || !DB_USERNAME || !DB_PASSWORD) {
  throw new Error(
    "Please define the DB_URL, DB_NAME, DB_USERNAME, and DB_PASSWORD environment variables inside .env.local"
  );
}

const MONGODB_URI = DB_URL.replace("<DB_NAME>", DB_NAME)
  .replace("<DB_USERNAME>", DB_USERNAME)
  .replace("<DB_PASSWORD>", DB_PASSWORD);

log(`Connecting to MongoDB at ${MONGODB_URI}...`);

const connectionOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

export const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, connectionOptions);
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  } catch (error) {
    logger.error("MongoDB disconnection error:", error);
  }
};
