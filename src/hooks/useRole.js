'use client';

import { useAuth } from '@/hooks/useAuth';
import { USER_ROLES } from '@/lib/constants/roles';

export function useRole() {
  const { user, loading } = useAuth();

  const role = user?.role ?? null;

  return {
    role,
    loading,
    isFarmer:  role === USER_ROLES.FARMER,
    isBuyer:   role === USER_ROLES.BUYER,
    isAdmin:   role === USER_ROLES.ADMIN,
    isStudent: role === USER_ROLES.STUDENT,

    // Check a single role
    is: (r) => role === r,

    // Check multiple roles at once e.g. hasAnyRole(['farmer', 'admin'])
    hasAnyRole: (roles) => roles.includes(role),
  };
}