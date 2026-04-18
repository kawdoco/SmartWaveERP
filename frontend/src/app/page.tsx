"use client";

/**
 * Root Page — /
 *
 * CHANGE: This page was an empty shell. It now acts as an auth guard:
 *  - If no JWT exists in localStorage → redirect to /login
 *  - If JWT exists → show the dashboard / home content
 *
 * This ensures that hitting "/" directly always sends unauthenticated
 * users to the login page first, and after login they land back here.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredToken } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  // null = still checking, true/false = result
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // CHANGE: check for a stored JWT token on mount
    const token = getStoredToken();
    if (!token) {
      // No token → send to login
      router.replace('/login');
    } else {
      // Token exists → allow the home page to render
      setIsAuthenticated(true);
    }
  }, [router]);

  // Show nothing while the auth check is happening (avoids flash of content)
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to SmartWave ERP
        </h1>
        <p className="text-xl text-gray-600">
          Dashboard — select a module from the sidebar.
        </p>
      </div>
    </div>
  );
}
