import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import {
  signInWithGoogle,
  signInWithEmail as authSignInWithEmail,
  signOut as authSignOut,
} from '@/services/auth';
import type { AuthUser, UserRole } from '@/types';
import { ROLE_HIERARCHY } from '@/types';

const AUTH_USER_KEY = 'motomoto_auth_user';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  hasMinRole: (minRole: UserRole) => boolean;
  signIn: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** Rehydrate auth state from SecureStore on app launch. */
  rehydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,

  hasMinRole: (minRole: UserRole): boolean => {
    const { user } = get();
    if (!user) return false;
    return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[minRole];
  },

  signIn: async () => {
    const authUser = await signInWithGoogle();
    await SecureStore.setItemAsync(AUTH_USER_KEY, JSON.stringify(authUser));
    set({ user: authUser, isAuthenticated: true });
  },

  signInWithEmail: async (email: string, password: string) => {
    const authUser = await authSignInWithEmail(email, password);
    await SecureStore.setItemAsync(AUTH_USER_KEY, JSON.stringify(authUser));
    set({ user: authUser, isAuthenticated: true });
  },

  signOut: async () => {
    await authSignOut();
    await SecureStore.deleteItemAsync(AUTH_USER_KEY);
    set({ user: null, isAuthenticated: false });
  },

  rehydrate: async () => {
    const raw = await SecureStore.getItemAsync(AUTH_USER_KEY);
    if (!raw) return;
    try {
      const authUser = JSON.parse(raw) as AuthUser;
      // Reject expired tokens — caller should trigger signIn again.
      if (authUser.expiresAt <= Date.now()) {
        await SecureStore.deleteItemAsync(AUTH_USER_KEY);
        return;
      }
      set({ user: authUser, isAuthenticated: true });
    } catch {
      // Corrupted data — clear it.
      await SecureStore.deleteItemAsync(AUTH_USER_KEY);
    }
  },
}));
