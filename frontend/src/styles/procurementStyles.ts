import { CSSProperties } from 'react';

/**
 * procurementStyles.ts
 * Specific styling for the Procurement (PO) workflows
 */

export const adderSectionStyle: CSSProperties = { 
  backgroundColor: '#F9FAFB', 
  borderRadius: '24px', 
  padding: '32px', 
  border: '1px solid #F1F5F9' 
};

export const sectionTitleStyle: CSSProperties = { 
  margin: '0 0 24px 0', 
  fontSize: '18px', 
  fontWeight: 800, 
  color: '#0A2540' 
};

export const adderGridStyle: CSSProperties = { 
  display: 'flex', 
  gap: '20px', 
  alignItems: 'flex-end', 
  marginBottom: '32px' 
};

export const subLabelStyle: CSSProperties = { 
  fontSize: '11px', 
  fontWeight: 700, 
  color: '#94A3B8', 
  marginBottom: '6px', 
  display: 'block', 
  textTransform: 'uppercase' 
};

export const addButtonStyle: CSSProperties = { 
  padding: '0 24px', 
  borderRadius: '14px', 
  backgroundColor: '#0A2540', 
  color: '#FFF', 
  border: 'none', 
  fontWeight: 700, 
  cursor: 'pointer', 
  height: '48px', 
  display: 'flex', 
  alignItems: 'center', 
  gap: '8px', 
  fontSize: '13px' 
};

export const tableStyle: CSSProperties = { 
  width: "100%", 
  borderCollapse: 'collapse' 
};

export const thRowStyle: CSSProperties = { 
  borderBottom: '2px solid #E2E8F0' 
};

export const thStyle: CSSProperties = { 
  textAlign: 'left', 
  padding: '12px', 
  fontSize: '11px', 
  fontWeight: 700, 
  color: '#94A3B8', 
  textTransform: 'uppercase' 
};

export const tdStyle: CSSProperties = { 
  padding: '16px 12px', 
  fontSize: '14px', 
  color: '#1E293B', 
  borderBottom: '1px solid #F1F5F9' 
};

export const trStyle: CSSProperties = { 
  backgroundColor: 'transparent' 
};

export const qtyInputStyle: CSSProperties = { 
  width: '100px', 
  padding: '10px', 
  borderRadius: '10px', 
  border: '1px solid #E2E8F0', 
  outline: 'none', 
  fontSize: '13px', 
  fontWeight: 600 
};

export const specBadgeStyle: CSSProperties = { 
  backgroundColor: '#FFF', 
  padding: '4px 10px', 
  borderRadius: '8px', 
  border: '1px solid #E2E8F0', 
  fontSize: '12px', 
  fontWeight: 600, 
  color: '#475569' 
};

export const removeButtonStyle: CSSProperties = { 
  background: 'none', 
  border: 'none', 
  color: '#EF4444', 
  cursor: 'pointer', 
  padding: '8px' 
};

export const totalRowStyle: CSSProperties = { 
  marginTop: '32px', 
  display: 'flex', 
  justifyContent: 'flex-end', 
  alignItems: 'center', 
  gap: '24px' 
};

export const footerStyle: CSSProperties = { 
  marginTop: '48px' 
};

export const submitButtonStyle: CSSProperties = { 
  width: '100%', 
  padding: '18px', 
  borderRadius: '16px', 
  backgroundColor: '#0A2540', 
  color: '#FFF', 
  fontSize: '18px', 
  fontWeight: 700, 
  border: 'none', 
  cursor: 'pointer', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  gap: '12px', 
  transition: 'all 0.2s' 
};

export const loadingStyle: CSSProperties = { 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  height: '100vh', 
  gap: '12px', 
  fontWeight: 600, 
  color: '#0A2540' 
};
