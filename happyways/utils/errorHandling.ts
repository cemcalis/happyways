import { Alert } from 'react-native';

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
      message: 'İnternet bağlantınızı kontrol edin',
      statusCode: error.statusCode,
      code: error.code
    };
  }

  if (error.response) {

    const status = error.response.status;
    const message = error.response.data?.message || 'Bir hata oluştu';

    switch (status) {
      case 401:
        return { message: 'Oturum süreniz dolmuş, lütfen tekrar giriş yapın', statusCode: 401 };
      case 403:
        return { message: 'Bu işlem için yetkiniz bulunmuyor', statusCode: 403 };
      case 404:
        return { message: 'Aranan kaynak bulunamadı', statusCode: 404 };
      case 500:
        return { message: 'Sunucu hatası oluştu, lütfen daha sonra tekrar deneyin', statusCode: 500 };
      default:
        return { message, statusCode: status };
    }
  }

  if (error.request) {

    return {
      message: 'Sunucuya bağlanılamadı, lütfen internet bağlantınızı kontrol edin',
      code: 'NETWORK_ERROR'
    };
  }

  return {
    message: error.message || 'Beklenmeyen bir hata oluştu'
  };
};

export const showErrorAlert = (error: ApiError) => {
  Alert.alert(
    'Hata',
    error.message,
    [{ text: 'Tamam', style: 'default' }]
  );
};

export const apiRequest = async (url: string, options: RequestInit = {}): Promise<any> => {
  try {
    if (!url) {
      throw new NetworkError('URL gerekli', undefined, 'INVALID_URL');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new NetworkError(
        errorData?.message || `HTTP ${response.status}`,
        response.status,
        'HTTP_ERROR'
      );
    }

    const data = await response.json();
    if (data === null || data === undefined) {
      throw new NetworkError('Sunucudan geçersiz yanıt alındı', 500, 'INVALID_RESPONSE');
    }

    return data;
  } catch (error: any) {
    if (error.name === 'NetworkError') {
      throw error;
    }
    
    throw new NetworkError(
      error.message || 'Bağlantı hatası oluştu',
      undefined,
      'CONNECTION_ERROR'
    );
  }
};
