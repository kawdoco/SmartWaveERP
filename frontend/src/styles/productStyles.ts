import { CSSProperties } from 'react';

/**
 * productStyles.ts
 * Specific styling for the Textile Inventory Dashboard
 */

export const headerSectionStyle: CSSProperties = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'flex-end', 
  marginBottom: '32px' 
};

export const subtitleStyle: CSSProperties = { 
  color: '#64748B', 
  fontSize: '15px' 
};

export const addButtonStyle: CSSProperties = { 
  display: 'flex', 
  alignItems: 'center', 
  gap: '8px', 
  padding: '14px 28px', 
  backgroundColor: '#0A2540', 
  color: '#FFFFFF', 
  borderRadius: '14px', 
  border: 'none', 
  fontWeight: 700, 
  cursor: 'pointer' 
};

export const statsRowStyle: CSSProperties = { 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
  gap: '24px', 
  marginBottom: '40px' 
};

export const statCardStyle: CSSProperties = { 
  backgroundColor: '#FFFFFF', 
  padding: '32px', 
  borderRadius: '24px', 
  display: 'flex', 
  alignItems: 'center', 
  gap: '24px', 
  border: '1px solid #F1F5F9' 
};

export const iconWrapperStyle: CSSProperties = { 
  width: '64px', 
  height: '64px', 
  borderRadius: '20px', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center' 
};

export const statLabelStyle: CSSProperties = { 
  fontSize: '13px', 
  fontWeight: 600, 
  color: '#64748B', 
  margin: 0 
};

export const statValueStyle: CSSProperties = { 
  fontSize: '24px', 
  fontWeight: 800, 
  color: '#0F172A', 
  marginTop: '4px', 
  margin: 0 
};

export const tableContainerStyle: CSSProperties = { 
  backgroundColor: '#FFFFFF', 
  borderRadius: '28px', 
  border: '1px solid #F1F5F9', 
  padding: '32px' 
};

export const searchBarContainerStyle: CSSProperties = { 
  position: 'relative' as const, 
  marginBottom: '32px', 
  maxWidth: '500px' 
};

export const searchInputStyle: CSSProperties = { 
  width: '100%', 
  padding: '14px 18px 14px 48px', 
  borderRadius: '14px', 
  border: '1px solid #E2E8F0', 
  outline: 'none' 
};

export const loadingContainerStyle: CSSProperties = { 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  justifyContent: 'center', 
  height: '100vh', 
  gap: '16px' 
};
