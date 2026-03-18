import { useAuthStore } from '@/store/useAuthStore';
import type { UserRole } from '@/types';

/**
 * Returns true if the current user meets or exceeds the given minimum role.
 * Uses ROLE_HIERARCHY for >= comparison (never direct equality checks).
 *
 * @example
 * const canManage = useRole('manager');
 */
export function useRole(minRole: UserRole): boolean {
  return useAuthStore((s) => s.hasMinRole(minRole));
}
