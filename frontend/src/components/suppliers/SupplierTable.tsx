"use client";

import React from "react";
import { Edit2, Trash2, Mail, Phone, MapPin, User } from "lucide-react";
import { SupplierDTO } from "@/lib/api";

/**
 * SupplierTable — A clean, industrial-grade table for displaying suppliers.
 * Provides edit and delete actions.
 */
interface SupplierTableProps {
  suppliers: SupplierDTO[];
  onEdit: (supplier: SupplierDTO) => void;
  onDelete: (id: number) => void;
}

export default function SupplierTable({ suppliers, onEdit, onDelete }: SupplierTableProps) {
  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Company Details</th>
            <th style={thStyle}>Contact Person</th>
            <th style={thStyle}>Communication</th>
            <th style={thStyle}>Location</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.length > 0 ? (
            suppliers.map((s) => (
              <tr key={s.id} style={trStyle} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '15px' }}>{s.name}</span>
                    <span style={{ fontSize: '12px', color: '#94A3B8' }}>ID: SPR-{s.id.toString().padStart(4, '0')}</span>
                  </div>
                </td>
                
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                    <User size={14} color="#94A3B8" />
                    <span>{s.contactPerson || "Not Assigned"}</span>
                  </div>
                </td>

                <td style={tdStyle}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={infoRowStyle}>
                      <Mail size={14} color="#94A3B8" />
                      <span style={{ fontSize: '13px' }}>{s.email || "—"}</span>
                    </div>
                    <div style={infoRowStyle}>
                      <Phone size={14} color="#94A3B8" />
                      <span style={{ fontSize: '13px' }}>{s.phoneNumber || "—"}</span>
                    </div>
                  </div>
                </td>

                <td style={tdStyle}>
                  <div style={{ ...infoRowStyle, alignItems: 'flex-start', maxWidth: '200px' }}>
                    <MapPin size={14} color="#94A3B8" style={{ marginTop: '3px' }} />
                    <span style={{ fontSize: '13px', lineHeight: '1.4' }}>{s.address || "No address provided"}</span>
                  </div>
                </td>

                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button 
                      onClick={() => onEdit(s)}
                      style={actionButtonStyle}
                      title="Edit Supplier"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(s.id)}
                      style={{ ...actionButtonStyle, color: '#EF4444' }}
                      title="Delete Supplier"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <MapPin size={40} strokeWidth={1} />
                  <p>No industrial suppliers found. Add your first partner to get started.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Styles
const containerStyle: React.CSSProperties = {
  overflowX: 'auto',
  borderRadius: '16px',
  border: '1px solid #F1F5F9'
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: '#FFFFFF'
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '16px 24px',
  fontSize: '11px',
  fontWeight: 700,
  color: '#64748B',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  borderBottom: '1px solid #F1F5F9',
  backgroundColor: '#FAFBFC'
};

const tdStyle: React.CSSProperties = {
  padding: '20px 24px',
  fontSize: '14px',
  color: '#1E293B',
  borderBottom: '1px solid #F1F5F9'
};

const trStyle: React.CSSProperties = {
  transition: 'background-color 0.2s ease'
};

const infoRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#475569'
};

const actionButtonStyle: React.CSSProperties = {
  padding: '8px',
  borderRadius: '8px',
  border: '1px solid #F1F5F9',
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  color: '#64748B',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s'
};
