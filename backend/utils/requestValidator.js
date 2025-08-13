import { sanitizeInput, errorResponse } from "./helpers.js";

export const validateAndSanitize = (req, res, next) => {
  try {
    ["body", "query"].forEach((key) => {
      const data = req[key];
      if (!data || typeof data !== "object") return;

      Object.keys(data).forEach((field) => {
        const value = data[field];
        const type = typeof value;

        if (type === "string") {
          const sanitized = sanitizeInput(value);
          if (!sanitized) {
            throw new Error(`Invalid ${key} parameter: ${field}`);
          }
          data[field] = sanitized;
        } else if (type === "number") {
          if (!Number.isFinite(value)) {
            throw new Error(`Invalid ${key} parameter: ${field}`);
          }
        } else if (type === "boolean") {
      
        } else {
          throw new Error(`Invalid ${key} parameter type: ${field}`);
        }
      });
    });
    next();
  } catch (err) {
    return errorResponse(res, err.message, 400, err);
  }
};