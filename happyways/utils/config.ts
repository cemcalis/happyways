
import { Platform } from 'react-native';

const defaultBaseUrl = Platform.select({
  ios: 'http://127.0.0.1:3000',
  android: 'http://10.0.2.2:3000',
  default: 'http://localhost:3000'
});

const baseUrlFromEnv = (typeof process !== 'undefined' && (process as any)?.env?.EXPO_PUBLIC_API_BASE_URL) || defaultBaseUrl;

export const API_CONFIG = {
  BASE_URL: baseUrlFromEnv as string,
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

export const APP_CONFIG = {
  APP_NAME: 'HappyWays',
  VERSION: '1.0.0',
  ENVIRONMENT: __DEV__ ? 'development' : 'production',
  ENABLE_LOGS: __DEV__,
};

export const STORAGE_KEYS = {
  USER_TOKEN: '@happyways_token',
  USER_DATA: 'user',
  LAST_SEARCHES: '@happyways_searches',
  SETTINGS: '@happyways_settings',
  ONBOARDING_COMPLETED: '@happyways_onboarding',
};

export const VALIDATION_CONFIG = {
  PASSWORD_MIN_LENGTH: 6,
  PHONE_MIN_LENGTH: 10,
  OTP_LENGTH: 6,
  OTP_EXPIRY_MINUTES: 5,
};

export const UI_CONFIG = {
  COLORS: {
    PRIMARY: '#f97316',
    SECONDARY: '#fb923c',
    SUCCESS: '#10b981',
    ERROR: '#ef4444',
    WARNING: '#f59e0b',
    INFO: '#3b82f6',
    GRAY: '#6b7280',
    LIGHT_GRAY: '#f3f4f6',
  },
  FONT_SIZES: {
    XS: 12,
    SM: 14,
    BASE: 16,
    LG: 18,
    XL: 20,
    XXL: 24,
  },
  SPACING: {
    XS: 4,
    SM: 8,
    BASE: 16,
    LG: 24,
    XL: 32,
  },
};
export const FEATURES = {
  ENABLE_NOTIFICATIONS: true,
  ENABLE_LOCATION_TRACKING: true,
  ENABLE_OFFLINE_MODE: false,
  ENABLE_BIOMETRIC_AUTH: true,
  ENABLE_ANALYTICS: true,
};

export const DATE_CONFIG = {
  DEFAULT_DATE_FORMAT: 'DD/MM/YYYY',
  DEFAULT_TIME_FORMAT: 'HH:mm',
  LOCALE: 'tr-TR',
  TIMEZONE: 'Europe/Istanbul',
};
