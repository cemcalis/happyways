import { errorResponse } from "./helpers.js";
import logger from "./logger.js";

export const handleError = (res, error, statusCode = 500, message = 'Internal Server Error') => {
  logger.error(error?.stack || error);
  return errorResponse(res, message, statusCode, error);
};

export const errorHandler = (err, req, res, next) => {
  logger.error(err?.stack || err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  return errorResponse(res, message, status, err);
};