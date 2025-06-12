//Load environment variables from .env file
import dotenv from "dotenv";
//Load environment variables from .env file
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  "NODE_ENV",
  "PORT",
  "DB_URL",
  "DB_NAME",
  "DB_USERNAME",
  "DB_PASSWORD",
];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Environment variable ${envVar} is missing`);
  }
}

// Application configuration
const config = {
  // Server configuration
  env: process.env.NODE_ENV as "development" | "production",
  port: parseInt(process.env.PORT || "3000", 10),
  corsOrigin: process.env.CORS_ORIGIN || "*",

  // Database configuration
  database: {
    url: process.env.DB_URL as string,
    name: process.env.DB_NAME as string,
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    poolSize: parseInt(process.env.DB_POOL_SIZE || "10", 10),
    connectionTimeout: parseInt(
      process.env.DB_CONNECTION_TIMEOUT || "5000",
      10
    ),
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || "info",
    dir: process.env.LOG_DIR || "logs",
    maxFiles: process.env.LOG_MAX_FILES || "30d",
  },

  // Security configuration
//   security: {
//     jwtSecret: process.env.JWT_SECRET as string,
//     jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
//     saltRounds: parseInt(process.env.SALT_ROUNDS || "10", 10),
//   },

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  },

  // API documentationconnectDatabases",
//   },

  // Monitoring
//   monitoring: {
//     enabled: process.env.MONITORING_ENABLED === "true",
//     route: process.env.MONITORING_ROUTE || "/status",
//   },
};

// Freeze config to prevent accidental modification
Object.freeze(config);

export default config;
