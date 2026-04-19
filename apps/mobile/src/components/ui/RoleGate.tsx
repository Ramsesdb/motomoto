import React from 'react';

import { useAuthStore } from '@/store/useAuthStore';
import type { UserRole } from '@/types';

interface RoleGateProps {
  /** Minimum role required to render children. Uses ROLE_HIERARCHY (≥ comparison). */
  minRole: UserRole;
  children: React.ReactNode;
  /** Optional content to render when the role check fails. Defaults to nothing. */
  fallback?: React.ReactNode;
}

/**
 * Conditionally renders `children` only when the authenticated user meets or
 * exceeds `minRole`. Renders `fallback` (default: null) otherwise.
 *
 * Role comparison goes through `useAuthStore.hasMinRole` which uses
 * `ROLE_HIERARCHY` — never a direct equality check.
 */
export function RoleGate({ minRole, children, fallback = null }: RoleGateProps) {
  const hasMinRole = useAuthStore((s) => s.hasMinRole);

  return hasMinRole(minRole) ? <>{children}</> : <>{fallback}</>;
}
