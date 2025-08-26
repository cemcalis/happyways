import { Alert } from 'react-native';
import i18n from '../i18n';

export interface ApiError {
  message: string;
  statusCode?: number;
  code?: string;
}

export class NetworkError extends Error {
  statusCode?: number;
  code?: string;

  constructor(message: string, statusCode?: number, code?: string) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const handleApiError = (error: any): ApiError => {
  console.error('API Error:', error);

  if (error.name === 'NetworkError') {
    return {
      message: i18n.t('errors.network'),
      statusCode: error.statusCode,
      code: error.code
    };
  }

  if (error.response) {

    const status = error.response.status;
    const message = error.response.data?.message || i18n.t('errors.generic');

    switch (status) {
      case 401:
        return { message: i18n.t('auth:sessionExpired'), statusCode: 401 };
      case 403:
        return { message: i18n.t('errors.forbidden'), statusCode: 403 };
      case 404:
        return { message: i18n.t('errors.notFound'), statusCode: 404 };
      case 500:
        return { message: i18n.t('errors.server'), statusCode: 500 };
      default:
        return { message, statusCode: status };
    }
  }

  if (error.request) {

    return {
      message: i18n.t('errors.cannotConnect'),
      code: 'NETWORK_ERROR'
    };
  }

  return {
    message: error.message || i18n.t('errors.unexpected')
  };
};

export const showErrorAlert = (error: ApiError) => {
  Alert.alert(
    i18n.t('common:error'),
    error.message,
    [{ text: i18n.t('common:ok'), style: 'default' }]
  );
};

export const apiRequest = async (url: string, options: RequestInit = {}): Promise<any> => {
  try {
    if (!url) {
      throw new NetworkError(i18n.t('errors.urlRequired'), undefined, 'INVALID_URL');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

      if (!response.ok) {
      let errorMessage: string | undefined;
      try {
        const errorData = await response.json();
        errorMessage = errorData?.message;
      } catch {
        try {
          errorMessage = await response.text();
        } catch {
          errorMessage = undefined;
        }
      }

      throw new NetworkError(
        errorMessage || `HTTP ${response.status}`,
        response.status,
        'HTTP_ERROR'
      );
    }

    const data = await response.json();
    if (data === null || data === undefined) {
      throw new NetworkError(i18n.t('errors.invalidResponse'), 500, 'INVALID_RESPONSE');
    }

    return data;
  } catch (error: any) {
    if (error.name === 'NetworkError') {
      throw error;
    }
    
    throw new NetworkError(
      error.message || i18n.t('errors.connection'),
      undefined,
      'CONNECTION_ERROR'
    );
  }
};
