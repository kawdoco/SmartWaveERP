"use client";

import React from "react";
import { Eye, Clock, CheckCircle, XCircle, Package, User, Trash2, RotateCcw, ArrowRightCircle } from "lucide-react";
import { PurchaseOrderResponse } from "@/lib/api";

/**
 * PurchaseOrderTable — Enhanced with conditional actions based on Lifecycle Status.
 */
interface POTableProps {
  orders: PurchaseOrderResponse[];
  onView: (order: PurchaseOrderResponse) => void;
  onApprove: (id: number) => void;
  onReceive: (id: number) => void;
  onCancel: (id: number) => void;
  onRestore: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function PurchaseOrderTable({ 
  orders, onView, onApprove, onReceive, onCancel, onRestore, onDelete 
}: POTableProps) {
  
  const getStatusConfig = (status: string) => {
    switch (status.toUpperCase()) {
      case 'RECEIVED': 
        return { icon: <Package size={14} />, bg: '#D1FAE5', text: '#065F46', label: 'Received' };
      case 'APPROVED': 
        return { icon: <CheckCircle size={14} />, bg: '#DBEAFE', text: '#1E40AF', label: 'Approved' };
      case 'CANCELLED': 
        return { icon: <XCircle size={14} />, bg: '#FEE2E2', text: '#991B1B', label: 'Cancelled' };
      default: 
        return { icon: <Clock size={14} />, bg: '#FEF3C7', text: '#92400E', label: 'Draft' };
    }
  };

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Order ID</th>
            <th style={thStyle}>Supplier & Date</th>
            <th style={thStyle}>Investment</th>
            <th style={thStyle}>Audit Trail</th>
            <th style={thStyle}>Status</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Lifecycle Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((po) => {
              const config = getStatusConfig(po.status);
              const status = po.status.toUpperCase();

              return (
                <tr key={po.id} style={trStyle}>
                  <td style={{ ...tdStyle, fontWeight: 800, color: '#1D4ED8' }}>
                    #{po.id.toString().padStart(5, '0')}
                  </td>
                  
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontWeight: 700 }}>{po.supplierName}</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                        {new Date(po.poDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>

                  <td style={tdStyle}>
                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '13px' }}>
                      LKR {po.totalAmount.toLocaleString()}
                    </div>
                  </td>

                  <td style={tdStyle}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={auditRowStyle}>
                        <User size={10} color="#94A3B8" />
                        <span>By: {po.createdByFullName}</span>
                      </div>
                      {po.approvedByFullName && (
                        <div style={auditRowStyle}>
                          <CheckCircle size={10} color="#059669" />
                          <span style={{ color: '#059669' }}>Appr: {po.approvedByFullName}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td style={tdStyle}>
                    <span style={{
                      backgroundColor: config.bg,
                      color: config.text,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '10px',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      textTransform: 'uppercase'
                    }}>
                      {config.icon}
                      {config.label}
                    </span>
                  </td>

                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      
                      {/* VIEW - All statuses */}
                      <button onClick={() => onView(po)} style={actionButtonStyle} title="View Details">
                        <Eye size={14} />
                      </button>

                      {/* DRAFT ACTIONS */}
                      {status === 'DRAFT' && (
                        <>
                          <button onClick={() => onApprove(po.id)} style={{ ...actionButtonStyle, color: '#2563EB', borderColor: '#BFDBFE' }} title="Approve Order">
                            <CheckCircle size={14} />
                          </button>
                          <button onClick={() => onCancel(po.id)} style={{ ...actionButtonStyle, color: '#DC2626', borderColor: '#FECACA' }} title="Cancel Order">
                            <XCircle size={14} />
                          </button>
                        </>
                      )}

                      {/* APPROVED ACTIONS */}
                      {status === 'APPROVED' && (
                        <>
                          <button onClick={() => onReceive(po.id)} style={{ ...actionButtonStyle, color: '#059669', borderColor: '#A7F3D0' }} title="Receive Stock">
                            <ArrowRightCircle size={14} />
                          </button>
                          <button onClick={() => onCancel(po.id)} style={{ ...actionButtonStyle, color: '#DC2626', borderColor: '#FECACA' }} title="Cancel Order">
                            <XCircle size={14} />
                          </button>
                        </>
                      )}

                      {/* CANCELLED ACTIONS */}
                      {status === 'CANCELLED' && (
                        <>
                           <button onClick={() => onRestore(po.id)} style={{ ...actionButtonStyle, color: '#7C3AED', borderColor: '#DDD6FE' }} title="Restore to Draft">
                            <RotateCcw size={14} />
                          </button>
                          <button onClick={() => onDelete(po.id)} style={{ ...actionButtonStyle, color: '#EF4444', borderColor: '#FEE2E2' }} title="Delete Record">
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>
                No records match your current filters.
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
  overflowX: 'auto', borderRadius: '16px', border: '1px solid #F1F5F9', backgroundColor: '#FFFFFF'
};

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' };

const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '14px 20px', fontSize: '10px', fontWeight: 700, color: '#64748B', 
  textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #F1F5F9', backgroundColor: '#FAFBFC'
};

const tdStyle: React.CSSProperties = {
  padding: '16px 20px', fontSize: '13px', color: '#1E293B', borderBottom: '1px solid #F8FAFC', verticalAlign: 'middle'
};

const trStyle: React.CSSProperties = { transition: 'all 0.2s' };

const auditRowStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748B'
};

const actionButtonStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', padding: '6px', borderRadius: '8px',
  border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', color: '#64748B', cursor: 'pointer', transition: 'all 0.2s'
};
