'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

/**
 * A nav link that requires login to visit.
 * - Logged in  → navigates normally
 * - Logged out → redirects to /login, then back after login
 *
 * Usage:
 *   <ProtectedLink href="/farmer/dashboard">My Farm</ProtectedLink>
 *
 *   // With custom className
 *   <ProtectedLink href="/orders" className="nav-link">Orders</ProtectedLink>
 *
 *   // With role restriction (optional)
 *   <ProtectedLink href="/admin/dashboard" role="admin">Admin</ProtectedLink>
 */
export default function ProtectedLink({ href, role, className, children }) {
  const { user } = useAuth();
  const router   = useRouter();

  const handleClick = (e) => {
    e.preventDefault();

    if (!user) {
      // Not logged in → go to login with callbackUrl
      router.push(`/login?callbackUrl=${encodeURIComponent(href)}`);
      return;
    }

    if (role) {
      const allowed = Array.isArray(role) ? role : [role];
      if (!allowed.includes(user.role) && user.role !== 'admin') {
        // Wrong role → send to their own dashboard
        router.push(`/${user.role}`);
        return;
      }
    }

    router.push(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}