"use client";

import React from 'react';

/**
 * Skeleton.tsx — Reusable UI loading states for SmartWave ERP
 * 
 * Provides a consistent "pulsing" effect for data loading periods
 * without breaking the existing layout or visual design.
 */

// ── Base Skeleton Pulse ───────────────────────────────────────────────────────
export const SkeletonPulse = ({ 
  width = '100%', 
  height = '20px', 
  borderRadius = '6px',
  className = "" 
}: { 
  width?: string | number; 
  height?: string | number; 
  borderRadius?: string;
  className?: string;
}) => (
  <div 
    className={`skeleton-pulse ${className}`}
    style={{
      width,
      height,
      borderRadius,
      backgroundColor: '#E2E8F0',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <style>{`
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.4; }
        100% { opacity: 1; }
      }
      .skeleton-pulse {
        animation: pulse 1.5s ease-in-out infinite;
      }
    `}</style>
  </div>
);

// ── Button Skeleton ───────────────────────────────────────────────────────────
export const ButtonSkeleton = ({ width = '120px' }: { width?: string }) => (
  <SkeletonPulse width={width} height="40px" borderRadius="10px" />
);

// ── Table Row Skeleton for /user ──────────────────────────────────────────────
/**
 * Mimics the exact grid layout from UsersPage
 * grid-template-columns: canManage ? "2fr 1.2fr 1.2fr 1fr 1.4fr 1fr" : "2fr 1.2fr 1.2fr 1fr 1.4fr"
 */
export const UserTableRowSkeleton = ({ canManage }: { canManage: boolean }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: canManage ? "2fr 1.2fr 1.2fr 1fr 1.4fr 1fr" : "2fr 1.2fr 1.2fr 1fr 1.4fr",
    padding: "14px 15px",
    borderTop: "1px solid #F1F5F9",
    alignItems: "center",
  }}>
    <SkeletonPulse width="70%" height="16px" />
    <SkeletonPulse width="60%" height="14px" />
    <SkeletonPulse width="80%" height="14px" />
    <SkeletonPulse width="50px" height="22px" borderRadius="20px" />
    <SkeletonPulse width="60px" height="24px" borderRadius="8px" />
    {canManage && (
      <div style={{ display: 'flex', gap: '6px' }}>
        <SkeletonPulse width="45px" height="28px" borderRadius="7px" />
        <SkeletonPulse width="55px" height="28px" borderRadius="7px" />
      </div>
    )}
  </div>
);

// ── Product Table Row Skeleton ────────────────────────────────────────────────
export const ProductTableRowSkeleton = () => (
  <tr style={{ borderBottom: '1px solid #F8FAFC' }}>
    <td style={{ padding: '20px 24px', width: '40px' }}><SkeletonPulse width="18px" height="18px" borderRadius="4px" /></td>
    <td style={{ padding: '20px 24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
         <SkeletonPulse width="180px" height="16px" />
         <SkeletonPulse width="80px" height="10px" />
      </div>
    </td>
    <td style={{ padding: '20px 24px' }}><SkeletonPulse width="100px" height="22px" borderRadius="8px" /></td>
    <td style={{ padding: '20px 24px' }}><SkeletonPulse width="70px" height="20px" borderRadius="8px" /></td>
    <td style={{ padding: '20px 24px' }}><SkeletonPulse width="90px" height="16px" /></td>
    <td style={{ padding: '20px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <SkeletonPulse width="32px" height="32px" borderRadius="8px" />
        <SkeletonPulse width="32px" height="32px" borderRadius="8px" />
        <SkeletonPulse width="32px" height="32px" borderRadius="8px" />
      </div>
    </td>
  </tr>
);

export const ProductTableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div style={{ overflowX: 'auto', borderRadius: '20px', border: '1px solid #F1F5F9', backgroundColor: '#FFFFFF' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: '#FAFBFC', borderBottom: '2px solid #F8FAFC' }}>
          {Array.from({ length: 6 }).map((_, i) => (
             <th key={i} style={{ padding: '18px 24px' }}><SkeletonPulse width="60px" height="12px" /></th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
           <ProductTableRowSkeleton key={i} />
        ))}
      </tbody>
    </table>
  </div>
);

// ── Full Table Skeleton ───────────────────────────────────────────────────────
export const UserTableSkeleton = ({ canManage, rows = 5 }: { canManage: boolean, rows?: number }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <UserTableRowSkeleton key={i} canManage={canManage} />
    ))}
  </>
);
