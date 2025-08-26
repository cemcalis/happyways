import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'userToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const saveToken = async (token: string) => {
  if (!token || typeof token !== 'string') {
    throw new Error('Token must be a non-empty string');
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const deleteToken = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error deleting token:', error);
  }
};

export const saveRefreshToken = async (refreshToken: string) => {
  if (!refreshToken || typeof refreshToken !== 'string') {
    throw new Error('Refresh token must be a non-empty string');
  }
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

export const deleteRefreshToken = async () => {
  try {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error deleting refresh token:', error);
  }
};
