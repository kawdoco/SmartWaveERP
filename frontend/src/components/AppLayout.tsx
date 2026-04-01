"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './SidebarNavigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  // Simple window resize listener to determine mobile vs desktop
  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 1024);
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoginPage) {
    return (
      <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        {children}
      </main>
    );
  }

  // Calculate dynamic left margin for desktop layouts
  const marginLeftDesktop = isCollapsed ? '80px' : '260px';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
      
      {/* Mobile Backdrop Map */}
      {isMobileOpen && isMobileScreen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            zIndex: 20,
            transition: 'opacity 0.3s ease'
          }}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Injection */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isMobileScreen={isMobileScreen}
      />

      {/* Main Content Pane */}
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flex: 1, 
          overflow: 'hidden',
          marginLeft: isMobileScreen ? '0' : marginLeftDesktop,
          transition: 'margin-left 0.3s ease'
        }}
      >
        {/* Mobile Header -> Only visible on screens < 1024px */}
        {isMobileScreen && (
          <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #e2e8f0',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setIsMobileOpen(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', letterSpacing: '-0.5px' }}>
                SmartWave
              </span>
            </div>
          </header>
        )}

        {/* Scrollable Document Area */}
        <main style={{ flex: 1, position: 'relative', overflowY: 'auto' }}>
          <div style={{ padding: isMobileScreen ? '16px' : '24px 32px' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
