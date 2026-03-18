import * as SecureStore from 'expo-secure-store';

import { USE_NATIVE_GOOGLE_SIGNIN } from '@/constants';
import { MOCK_CURRENT_USER } from '@/mock';
import type { AuthUser } from '@/types';

import { AUTH_TOKEN_KEY } from './api';

const REFRESH_TOKEN_KEY = 'motomoto_refresh_token';

function buildMockAuthUser(): AuthUser {
  return {
    ...MOCK_CURRENT_USER,
    accessToken: 'mock_access_token_dev',
    refreshToken: 'mock_refresh_token_dev',
    expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
  };
}

/**
 * Sign in with Google.
 * When USE_NATIVE_GOOGLE_SIGNIN is true, delegates to the native SDK (requires dev client).
 * Otherwise returns a mock AuthUser for development.
 */
export async function signInWithGoogle(): Promise<AuthUser> {
  if (USE_NATIVE_GOOGLE_SIGNIN) {
    // TODO: implement with @react-native-google-signin/google-signin
    throw new Error('Native Google Sign-In not yet implemented');
  }

  const authUser = buildMockAuthUser();
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, authUser.accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, authUser.refreshToken);
  return authUser;
}

/**
 * Sign in with email + password.
 * Currently returns a mock AuthUser for development.
 * TODO: implement real API call to POST /auth/login
 */
export async function signInWithEmail(
  _email: string,
  _password: string,
): Promise<AuthUser> {
  const authUser = buildMockAuthUser();
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, authUser.accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, authUser.refreshToken);
  return authUser;
}

/** Clear all stored tokens and end the session. */
export async function signOut(): Promise<void> {
  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

/**
 * Exchange the stored refresh token for a new access token.
 * Throws if no refresh token is present (user must sign in again).
 */
export async function refreshToken(): Promise<AuthUser> {
  const storedRefreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  if (!storedRefreshToken) {
    throw new Error('No refresh token available — user must sign in again');
  }

  const authUser = buildMockAuthUser();
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, authUser.accessToken);
  return authUser;
}
