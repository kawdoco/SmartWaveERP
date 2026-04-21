"use client";

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
  label: string;
  icon: ReactNode;
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, href, isActive, isCollapsed }) => {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          margin: '4px 8px',
          cursor: 'pointer',
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          color: isActive ? '#FFFFFF' : '#64748b',
          backgroundColor: isActive ? '#0A2540' : 'transparent',
          justifyContent: isCollapsed ? 'center' : 'flex-start'
        }}
        title={isCollapsed ? label : undefined}
      >
        <div style={{ 
          marginRight: isCollapsed ? '0px' : '12px', 
          display: 'flex', 
          alignItems: 'center',
          opacity: isActive ? 1 : 0.7 
        }}>
          {icon}
        </div>
        {!isCollapsed && (
          <span style={{ 
            fontSize: '15px', 
            fontWeight: isActive ? 600 : 500,
            whiteSpace: 'nowrap'
          }}>
            {label}
          </span>
        )}
      </div>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Icon Definitions
  const dashboardIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
  const userIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>;
  const productsIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline></svg>;
  const procurementIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon></svg>;
  const inventoryIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>;
  const posIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
  const reportsIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
  const settingsIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;

  const menuConfig = [
    { label: 'Dashboard', href: '/', icon: dashboardIcon },
    { label: 'User Management', href: '/user', icon: userIcon },
    { label: 'Products', href: '/products', icon: productsIcon },
    { label: 'Procurement', href: '/purchasing', icon: procurementIcon },
    { label: 'Inventory', href: '/inventory', icon: inventoryIcon },
    { label: 'POS', href: '/pos', icon: posIcon },
    { label: 'Reports', href: '/reports', icon: reportsIcon },
    { label: 'Settings', href: '/settings', icon: settingsIcon },
  ];

  return (
    <div style={{ 
      width: isCollapsed ? '80px' : '260px', 
      height: '100vh', 
      backgroundColor: '#FFFFFF', 
      borderRight: '1px solid #e2e8f0', 
      position: 'fixed', 
      display: 'flex', 
      flexDirection: 'column', 
      fontFamily: 'Inter, system-ui, sans-serif',
      transition: 'width 0.3s ease'
    }}>
      {/* Branding and Collapse Toggle */}
      <div style={{ padding: isCollapsed ? '32px 12px' : '32px 24px', display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', transition: 'all 0.3s ease' }}>
        {!isCollapsed && (
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>
              SmartWave
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.5px', whiteSpace: 'nowrap' }}>
              ERP SYSTEM
            </p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#64748b',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {isCollapsed ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          )}
        </button>
      </div>

      {/* Menu List */}
      <nav style={{ flex: 1, paddingTop: '10px', overflowY: 'auto', overflowX: 'hidden' }}>
        {menuConfig.map((item) => (
          <NavItem
            key={item.href}
            label={item.label}
            icon={item.icon}
            href={item.href}
            isActive={pathname === item.href}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* Optional Footer/User Section */}
      <div style={{ padding: '20px', borderTop: '1px solid #f1f5f9', fontSize: '12px', color: '#94a3b8', textAlign: 'center', transition: 'opacity 0.3s', opacity: isCollapsed ? 0 : 1, overflow: 'hidden', whiteSpace: 'nowrap' }}>
        {!isCollapsed && "v1.0.0 Stable"}
      </div>
    </div>
  );
};

export default Sidebar;