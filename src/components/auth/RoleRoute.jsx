'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

/**
 * Wraps pages that require a specific role.
 * - Not logged in → redirect to /login
 * - Wrong role (including admin) → redirect to their own dashboard
 *
 * Usage:
 *   <RoleRoute role="farmer">
 *     <FarmerDashboard />
 *   </RoleRoute>
 *
 *   // Allow multiple roles
 *   <RoleRoute role={["farmer", "buyer"]}>
 *     <SharedPage />
 *   </RoleRoute>
 */
export default function RoleRoute({ children, role, fallback = null }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const allowedRoles = Array.isArray(role) ? role : [role];
  const hasAccess    = user && allowedRoles.includes(user.role);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (!hasAccess) {
      // Every role goes to their own dashboard — admin included
      router.replace(`/${user.role}/dashboard`);
    }
  }, [user, loading, hasAccess, router]);

  if (loading || !user || !hasAccess) return fallback;

  return <>{children}</>;
}