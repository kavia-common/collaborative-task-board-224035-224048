import { logger } from "./logger";

/**
 * Standard App Error object for user-friendly messages and internal logs.
 */
export class AppError extends Error {
  constructor(message, code = "APP_ERROR", details = {}) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

// PUBLIC_INTERFACE
export function handleError(err, context = {}) {
  const msg = err?.message || "Unexpected error";
  const code = err?.code || "APP_ERROR";
  logger.error(msg, { code, ...context });
  return new AppError("Something went wrong. Please try again.", code);
}
