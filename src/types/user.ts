export type UserRole = 'agent' | 'manager' | 'admin';

export type UserStatus = 'online' | 'away' | 'offline';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser extends User {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

/**
 * Ordered from lowest to highest privilege.
 * Use with ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[minRole] for comparisons.
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  agent: 0,
  manager: 1,
  admin: 2,
};
