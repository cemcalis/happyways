import { errorResponse } from "./helpers.js";

export const handleError = (res, error, statusCode = 500, message = 'Internal Server Error') => {
  console.error(error);
  return errorResponse(res, message, statusCode, error);
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  return errorResponse(res, message, status, err);
};