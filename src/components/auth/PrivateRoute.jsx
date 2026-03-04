'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

/**
 * Wraps any page/section that requires the user to be logged in.
 * - If not logged in → redirect to /login instantly
 * - If user logs out WHILE on this page → redirect to /login instantly
 * - While auth state is loading → show fallback (default: nothing)
 *
 * Usage:
 *   <PrivateRoute>
 *     <MyPage />
 *   </PrivateRoute>
 *
 *   <PrivateRoute fallback={<Spinner />}>
 *     <MyPage />
 *   </PrivateRoute>
 */
export default function PrivateRoute({ children, fallback = null }) {
  const { user, loading } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      // Preserve where the user was trying to go
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading || !user) return fallback;

  return <>{children}</>;
}