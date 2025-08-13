import crypto from 'crypto';
import jwt from 'jsonwebtoken';


export const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hash };
};

export const verifyPassword = (password, salt, hash) => {
  const hashVerify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
};


export const generateToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', { expiresIn });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
  } catch (error) {
    return null;
  }
};


export const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
};


export const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes);
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const isDateBetween = (date, startDate, endDate) => {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return d >= start && d <= end;
};


export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>\"']/g, '');
};


export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

export const errorResponse = (res, message = 'Error', statusCode = 500, error = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: error?.message || error,
    timestamp: new Date().toISOString()
  });
};


export const sanitizeDbInput = (input) => {
  if (typeof input === 'string') {
    return input.replace(/'/g, "''"); 
  }
  return input;
};

export const buildUpdateQuery = (tableName, updates, whereClause) => {
  const setClause = Object.keys(updates)
    .map(key => `${key} = ?`)
    .join(', ');
  
  return `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`;
};

export const buildInsertQuery = (tableName, data) => {
  const columns = Object.keys(data).join(', ');
  const placeholders = Object.keys(data).map(() => '?').join(', ');
  
  return {
    query: `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`,
    values: Object.values(data)
  };
};

export const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

export const isValidImageFile = (filename) => {
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const extension = getFileExtension(filename);
  return validExtensions.includes(extension);
};

export const calculateTotalPrice = (basePrice, taxRate = 0.18, discountPercent = 0) => {
  const discountedPrice = basePrice * (1 - discountPercent / 100);
  const tax = discountedPrice * taxRate;
  return {
    basePrice,
    discountAmount: basePrice - discountedPrice,
    taxAmount: tax,
    totalPrice: discountedPrice + tax
  };
};

export const formatCurrency = (amount, currency = 'TRY') => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const paginate = (array, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    data: array.slice(startIndex, endIndex),
    pagination: {
      page,
      limit,
      total: array.length,
      totalPages: Math.ceil(array.length / limit),
      hasNext: endIndex < array.length,
      hasPrev: page > 1
    }
  };
};

export const logInfo = (message, data = null) => {
  const timestamp = new Date().toISOString();
  console.log(`[INFO] ${timestamp}: ${message}`, data ? JSON.stringify(data, null, 2) : '');
};

export const logError = (message, error = null) => {
  const timestamp = new Date().toISOString();
  console.error(`[ERROR] ${timestamp}: ${message}`, error);
};
