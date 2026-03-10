"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// --- Icons ---
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
  const router = useRouter();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login and redirect to the dashboard
    if (username && password) {
      router.push('/'); 
    }
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      backgroundColor: '#f1f5f9', // Light grey background for contrast
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
          backgroundColor: '#0A2540', // Navy Blue
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

        {/* White Form Section */}
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
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
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
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0A2540'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            />
          </div>

          {/* Navy Blue Button */}
          <button type="submit" style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#0A2540', // Navy Blue
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'opacity 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            <SignIcon /> Sign In
          </button>

          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', marginTop: '32px', fontWeight: 500 }}>
            Contact administrator if you forgot your credentials.
          </p>
        </form>
      </div>
    </div>
  );
}