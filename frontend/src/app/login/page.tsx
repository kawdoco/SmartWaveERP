"use client";

/**
 * Login Page — /login
 *
 * RESOLVED MERGE CONFLICT:
 * This page now combines the "Real API Integration" from dev_copy
 * with the "Forgot Password / Reset Mode" UI functionality from dev.
 *
 * 1. Uses authApi.login() for real authentication.
 * 2. Saves JWT/User info to localStorage on success.
 * 3. Includes "Forgot Password" toggle which switches the form to reset mode.
 * 4. Added loading and error states for a premium UX.
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, saveAuthData } from '@/lib/api';

// --- Icons (from local head and dev_copy) ---
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

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  /** 
   * Handle the form submission based on current mode (Login vs Reset)
   */
  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (isResetMode) {
      // --- Reset Logic (UI only for now) ---
      console.log("Reset link requested for:", username);
      alert("If an account exists, a reset link has been sent to your email.");
      setIsResetMode(false);
    } else {
      // --- Real Login Logic (from dev_copy) ---
      setIsLoading(true);
      try {
        const authData = await authApi.login(username, password);
        saveAuthData(authData);
        router.push('/');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
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
        
        {/* Navy Blue Header Section */}
        <div style={{
          background: 'linear-gradient(135deg, #1E40AF 0%, #1D4ED8 50%, #2563EB 100%)',
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
            {isResetMode ? 'Reset Password' : 'SmartWave'}
          </h1>
          <p style={{ margin: '8px 0 0', fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>
            {isResetMode ? 'Enter your email/username to recover access' : 'Secure Module Access'}
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleAction} style={{ padding: '40px 32px' }}>
          
          {/* Email / Username field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
              {isResetMode ? 'Email or Username' : 'Username'}
            </label>
            <input 
              type="text" 
              placeholder={isResetMode ? "email@example.com" : "Enter your username"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
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

          {/* Password field - Only shown in Login mode */}
          {!isResetMode && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                  Password
                </label>
                <button 
                  type="button"
                  onClick={() => setIsResetMode(true)}
                  style={{ 
                    background: 'none', border: 'none', color: '#1D4ED8', 
                    fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0 
                  }}
                >
                  Forgot Password?
                </button>
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!isResetMode}
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
          )}

          {/* Error banner */}
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

          {/* Action Button */}
          <button type="submit" disabled={isLoading} style={{
            width: '100%',
            padding: '16px',
            background: isLoading ? '#93C5FD' : 'linear-gradient(135deg, #1D4ED8, #2563EB)',
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
            transition: 'all 0.2s',
            opacity: isLoading ? 0.85 : 1,
            boxShadow: isLoading ? 'none' : '0 4px 12px rgba(29, 78, 216, 0.35)',
          }}
          onMouseOver={(e) => { if (!isLoading) e.currentTarget.style.opacity = '0.92'; }}
          onMouseOut={(e) => { if (!isLoading) e.currentTarget.style.opacity = '1'; }}
          >
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
              isResetMode ? <><MailIcon /> Send Reset Link</> : <><SignIcon /> Sign In</>
            )}
          </button>

          {/* Back to Login link */}
          {isResetMode && (
            <button 
              type="button" 
              onClick={() => setIsResetMode(false)}
              style={{
                width: '100%', marginTop: '16px', background: 'none', border: 'none',
                color: '#64748b', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
              }}
            >
              Back to Login
            </button>
          )}

          {/* Inline keyframes for the spinner animation */}
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', marginTop: '32px', fontWeight: 500 }}>
            {isResetMode 
              ? "Need more help? Contact technical support."
              : "Contact administrator if you forgot your credentials."}
          </p>
        </form>
      </div>
    </div>
  );
}