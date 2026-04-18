"use client";

/**
 * Login Page — /login
 *
 * CHANGES:
 * 1. handleSignIn now calls the real backend via authApi.login()
 *    instead of the old stub that just checked if the fields were non-empty.
 * 2. saveAuthData() stores the JWT + user info to localStorage after success.
 * 3. Added loading and error states so the user gets visual feedback.
 * 4. The root page (/) now redirects here if no token is stored (see page.tsx).
 *
 * UI is intentionally UNCHANGED — same colours, fonts, layout.
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, saveAuthData } from '@/lib/api'; // CHANGE: real API client

// --- Icons (unchanged) ---
const ShieldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="M9 12l2 2 4-4"></path>
  </svg>
);

const SignIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/>
  </svg>
);

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // CHANGE: added loading flag to disable the button while the request is in flight
  const [isLoading, setIsLoading] = useState(false);

  // CHANGE: added error state to display backend error messages below the form
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  /**
   * CHANGE: handleSignIn was a stub that only checked for non-empty fields.
   * It now:
   *  1. Calls POST /auth/login via authApi.login()
   *  2. On success → saves JWT to localStorage, redirects to "/"
   *  3. On failure → shows the error message from the backend
   */
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);       // clear any previous error
    setIsLoading(true);   // disable the button

    try {
      const authData = await authApi.login(username, password);
      saveAuthData(authData); // persist JWT + user info to localStorage
      router.push('/');       // redirect to the dashboard
    } catch (err: unknown) {
      // Show whatever error message the backend returned
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false); // re-enable the button regardless of outcome
    }
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      backgroundColor: '#f1f5f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999,
    }}>
      <div style={{
        width: '400px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
        border: '1px solid #e2e8f0'
      }}>
        
        {/* Navy Blue Header Section (unchanged) */}
        <div style={{
          backgroundColor: '#0A2540',
          padding: '48px 24px',
          textAlign: 'center',
          color: '#FFFFFF'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <ShieldIcon />
          </div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            SmartWave
          </h1>
          <p style={{ margin: '8px 0 0', fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>
            Secure Module Access
          </p>
        </div>

        {/* White Form Section (unchanged layout, added error banner + loading state) */}
        <form onSubmit={handleSignIn} style={{ padding: '40px 32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
              Username
            </label>
            <input 
              type="text" 
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              // CHANGE: disabled while loading to prevent double-submit
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
                opacity: isLoading ? 0.7 : 1,
              }}
              onFocus={(e) => e.target.style.borderColor = '#0A2540'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
              Password
            </label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              // CHANGE: disabled while loading
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box',
                opacity: isLoading ? 0.7 : 1,
              }}
              onFocus={(e) => e.target.style.borderColor = '#0A2540'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            />
          </div>

          {/* CHANGE: Error banner — only rendered when there is an error message */}
          {error && (
            <div style={{
              marginBottom: '20px',
              padding: '12px 16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              color: '#b91c1c',
              fontSize: '14px',
              fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          {/* Navy Blue Button — CHANGE: shows "Signing in…" text while loading */}
          <button type="submit" disabled={isLoading} style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#0A2540',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'opacity 0.2s',
            opacity: isLoading ? 0.75 : 1,
          }}
          onMouseOver={(e) => { if (!isLoading) e.currentTarget.style.opacity = '0.9'; }}
          onMouseOut={(e) => { if (!isLoading) e.currentTarget.style.opacity = '1'; }}
          >
            {/* CHANGE: swap the icon for a spinner and change the label when loading */}
            {isLoading ? (
              <>
                <span style={{
                  width: '18px', height: '18px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#ffffff',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.7s linear infinite',
                }} />
                Signing in…
              </>
            ) : (
              <><SignIcon /> Sign In</>
            )}
          </button>

          {/* Inline keyframes for the spinner animation */}
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', marginTop: '32px', fontWeight: 500 }}>
            Contact administrator if you forgot your credentials.
          </p>
        </form>
      </div>
    </div>
  );
}