import { errorResponse } from "./helpers.js";


export const ALLOW_OBJECT_FIELDS = new Set([
  "carInfo",
  "insuranceOptions",
  "price_breakdown",
  "priceBreakdown",
  "payment",
  "status_info",
  "conditions",
  "rental_terms",
  "vehicle_terms",
]);

export const sanitizeInput = (value) => {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();

  if (trimmed.length === 0 || trimmed.length > 10000) return "";

  const noCtl = trimmed.replace(/[\u0000-\u001F\u007F]/g, "");


  const escaped = noCtl.replace(/[&<>"']/g, (ch) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[ch] || ch;
  });

  return escaped;
};


export const validateAndSanitize = (req, res, next) => {
  try {
    ["body", "query"].forEach((key) => {
      const data = req[key];
      if (!data || typeof data !== "object") return;

      Object.keys(data).forEach((field) => {
        const value = data[field];

 
        if (value === null || value === undefined) return;

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

        } else if (type === "object") {
      
          if (Array.isArray(value)) return;
          if (ALLOW_OBJECT_FIELDS.has(field)) return;

          throw new Error(`Invalid ${key} parameter type: ${field}`);
        } else {
    
          throw new Error(`Invalid ${key} parameter type: ${field}`);
        }
      });
    });

    return next();
  } catch (err) {
    return errorResponse(res, err.message, 400, err);
  }
};
