import axios, { AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';

import type { ApiError } from '@/types';

export const API_BASE_URL = 'https://api.motomoto.mx/v1';

/** Key used to persist the access token in expo-secure-store. */
export const AUTH_TOKEN_KEY = 'motomoto_access_token';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach access token from secure storage on every request.
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize all error responses into ApiError.
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeError(error)),
);

export function normalizeError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    if (error.response) {
      const data = error.response.data as Record<string, unknown>;
      return {
        code: typeof data['code'] === 'string' ? data['code'] : 'API_ERROR',
        message:
          typeof data['message'] === 'string' ? data['message'] : error.message,
        statusCode: error.response.status,
        details:
          data['details'] !== null && typeof data['details'] === 'object'
            ? (data['details'] as Record<string, unknown>)
            : undefined,
      };
    }
    // Network / timeout — no response object
    return {
      code: 'NETWORK_ERROR',
      message: error.message,
      statusCode: 0,
    };
  }
  return {
    code: 'UNKNOWN_ERROR',
    message:
      error instanceof Error ? error.message : 'An unknown error occurred',
    statusCode: 0,
  };
}
