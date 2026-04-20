"use client";

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearAuthData, getStoredUser } from '@/lib/api'; // CHANGE: getStoredUser helper

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (value: boolean) => void;
  isMobileScreen: boolean;
}

interface NavItemProps {
  label: string;
  icon: ReactNode;
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, href, isActive, isCollapsed, onClick }) => {
  return (
    <Link href={href} onClick={onClick} style={{ textDecoration: 'none' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          margin: '4px 12px',
          cursor: 'pointer',
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          color: isActive ? '#FFFFFF' : '#64748b',
          backgroundColor: isActive ? '#1e293b' : 'transparent',
          boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
        }}
        title={isCollapsed ? label : undefined}
        onMouseOver={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = '#f1f5f9';
            e.currentTarget.style.color = '#0f172a';
          }
        }}
        onMouseOut={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#64748b';
          }
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          marginRight: isCollapsed ? '0' : '12px',
          opacity: isActive ? 1 : 0.7,
          transition: 'color 0.2s',
          color: isActive ? '#FFFFFF' : 'inherit'
        }}>
          {icon}
        </div>
        {!isCollapsed && (
          <span style={{
            fontSize: '14px',
            fontWeight: isActive ? 600 : 500,
            whiteSpace: 'nowrap',
            transition: 'color 0.2s'
          }}>
            {label}
          </span>
        )}
      </div>
    </Link>
  );
};

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen, isMobileScreen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    const user = getStoredUser();
    if (user) {
      setUserRole(user.role);
    }
  }, []);

  const handleLogout = () => {
    clearAuthData();
    router.push('/login');
  };

  const dashboardIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
  const userIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>;
  const productsIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline></svg>;
  const procurementIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon></svg>;
  const inventoryIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>;
  const posIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
  const reportsIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
  const settingsIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
  const logoutIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;

  const menuConfig = [
    { label: 'Dashboard', href: '/', icon: dashboardIcon },
    { label: 'User Management', href: '/user', icon: userIcon, roleRestricted: true },
    { label: 'Products', href: '/products', icon: productsIcon },
    { label: 'Procurement', href: '/purchasing', icon: procurementIcon },
    { label: 'Suppliers', href: '/purchasing/suppliers', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
    { label: 'Inventory', href: '/inventory', icon: inventoryIcon },
    { label: 'POS', href: '/pos', icon: posIcon },
    { label: 'Reports', href: '/reports', icon: reportsIcon },
    { label: 'Settings', href: '/settings', icon: settingsIcon },
  ];

  // CHANGE: Filter menu items based on role
  const filteredMenu = menuConfig.filter(item => {
    if (item.roleRestricted) {
      return userRole === 'ADMIN' || userRole === 'MANAGER';
    }
    return true;
  });

  // Dynamic Styles Calculation
  const sidebarWidth = isCollapsed ? '80px' : '260px';
  
  let transformState = 'translateX(0)';
  if (isMobileScreen) {
    transformState = isMobileOpen ? 'translateX(0)' : 'translateX(-100%)';
  }

  // Treat 'isCollapsed' functionally as true on mobile unless specifically built to not 
  const effectiveCollapsed = isMobileScreen ? false : isCollapsed;

  return (
    <div style={{
      position: isMobileScreen ? 'fixed' : 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      zIndex: 30,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      borderRight: '1px solid #e2e8f0',
      width: isMobileScreen ? '260px' : sidebarWidth,
      transform: transformState,
      transition: 'width 0.3s ease, transform 0.3s ease',
    }}>
      
      {/* Header & Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: effectiveCollapsed ? 'center' : 'space-between',
        flexShrink: 0,
        height: '64px',
        borderBottom: '1px solid #f1f5f9',
        padding: effectiveCollapsed ? '0 16px' : '0 24px',
        transition: 'all 0.3s ease',
      }}>
        {!effectiveCollapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              SmartWave
            </h1>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              ERP System
            </span>
          </div>
        )}

        {/* Desktop Collapse Toggle */}
        {!isMobileScreen && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              cursor: 'pointer',
              color: '#94a3b8',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '50%',
              transition: 'background-color 0.2s, color 0.2s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#475569'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            )}
          </button>
        )}

        {/* Mobile Close Button */}
        {isMobileScreen && (
          <button
            onClick={() => setIsMobileOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              color: '#94a3b8',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer'
            }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      {/* Nav Actions */}
      <nav style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingTop: '16px',
        paddingBottom: '16px',
      }}>
        {filteredMenu.map((item) => (
          <NavItem
            key={item.href}
            label={item.label}
            icon={item.icon}
            href={item.href}
            isActive={pathname === item.href}
            isCollapsed={effectiveCollapsed}
            onClick={() => setIsMobileOpen(false)} 
          />
        ))}

        {/* Logout Action */}
        <div 
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            margin: '20px 12px 4px',
            cursor: 'pointer',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            justifyContent: effectiveCollapsed ? 'center' : 'flex-start',
            color: '#dc2626',
            backgroundColor: 'transparent',
            borderTop: '1px solid #f1f5f9'
          }}
          title={effectiveCollapsed ? 'Logout' : undefined}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#fef2f2';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            marginRight: effectiveCollapsed ? '0' : '12px',
          }}>
            {logoutIcon}
          </div>
          {!effectiveCollapsed && (
            <span style={{ fontSize: '14px', fontWeight: 600 }}>
              Logout
            </span>
          )}
        </div>
      </nav>

      {/* Footer Info */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid #f1f5f9',
        fontSize: '12px',
        color: '#94a3b8',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        opacity: effectiveCollapsed ? 0 : 1,
        height: effectiveCollapsed ? 0 : 'auto',
        overflow: 'hidden',
        transition: 'opacity 0.3s'
      }}>
        v1.0.0 Stable
      </div>
    </div>
  );
}
