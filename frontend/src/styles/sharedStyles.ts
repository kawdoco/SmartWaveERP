import { CSSProperties } from 'react';

/**
 * sharedStyles.ts
 * Common styling tokens for SmartWave ERP pages
 */

export const pageStyle: CSSProperties = { 
  minHeight: "100vh", 
  backgroundColor: "#F8FAFC", 
  padding: "40px", 
  fontFamily: "Inter, sans-serif" 
};

export const containerStyle: CSSProperties = { 
  maxWidth: "1000px", 
  margin: "0 auto" 
};

export const cardStyle: CSSProperties = { 
  backgroundColor: "#FFFFFF", 
  borderRadius: "32px", 
  padding: "48px", 
  border: '1px solid #E2E8F0',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
};

export const titleStyle: CSSProperties = { 
  fontSize: "32px", 
  fontWeight: "800", 
  color: "#0F172A", 
  marginBottom: "8px", 
  letterSpacing: '-1px' 
};

export const inputStyle: CSSProperties = { 
  width: "100%", 
  padding: "14px", 
  borderRadius: "14px", 
  border: "1px solid #E2E8F0", 
  outline: "none",
  fontSize: '14px',
  backgroundColor: '#FFFFFF'
};

export const labelStyle: CSSProperties = { 
  display: "block", 
  fontSize: "12px", 
  fontWeight: 700, 
  color: "#64748B", 
  marginBottom: "8px", 
  textTransform: 'uppercase' 
};

export const fieldGroupStyle: CSSProperties = { 
  marginBottom: "32px" 
};

export const backButtonStyle: CSSProperties = { 
  display: 'flex', 
  alignItems: 'center', 
  gap: '8px', 
  color: '#64748B', 
  textDecoration: 'none', 
  marginBottom: '24px', 
  fontWeight: 600,
  fontSize: '14px'
};

export const errorStyle: CSSProperties = { 
  padding: '16px', 
  borderRadius: '16px', 
  backgroundColor: '#FEF2F2', 
  color: '#DC2626', 
  fontSize: '14px', 
  marginBottom: '32px', 
  display: 'flex', 
  alignItems: 'center', 
  gap: '10px', 
  fontWeight: 600, 
  border: '1px solid #FEE2E2' 
};
