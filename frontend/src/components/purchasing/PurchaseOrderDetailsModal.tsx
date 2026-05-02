"use client";

import React from "react";
import { X, Calendar, User, Truck, DollarSign, Package, CheckCircle, Clock } from "lucide-react";
import { PurchaseOrderResponse } from "@/lib/api";

interface PODetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: PurchaseOrderResponse | null;
}

export default function PurchaseOrderDetailsModal({ isOpen, onClose, order }: PODetailsModalProps) {
  if (!isOpen || !order) return null;

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'RECEIVED': return { bg: '#D1FAE5', text: '#065F46', icon: <Package size={16} /> };
      case 'CANCELLED': return { bg: '#FEE2E2', text: '#991B1B', icon: <X size={16} /> };
      case 'APPROVED': return { bg: '#DBEAFE', text: '#1E40AF', icon: <CheckCircle size={16} /> };
      default: return { bg: '#FEF3C7', text: '#92400E', icon: <Clock size={16} /> };
    }
  };

  const statusStyle = getStatusColor(order.status);

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={titleStyle}>Purchase Order #{order.id.toString().padStart(5, '0')}</h2>
            <span style={{ 
              backgroundColor: statusStyle.bg, color: statusStyle.text, 
              padding: '4px 12px', borderRadius: '20px', fontSize: '11px', 
              fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' 
            }}>
              {statusStyle.icon}
              {order.status}
            </span>
          </div>
          <button onClick={onClose} style={closeButtonStyle}><X size={20} /></button>
        </div>

        {/* Content Section */}
        <div style={contentStyle}>
          {/* Top Info Grid */}
          <div style={infoGridStyle}>
            <InfoItem icon={<Truck size={18} />} label="Supplier" value={order.supplierName} />
            <InfoItem icon={<Calendar size={18} />} label="Date Created" value={new Date(order.poDate).toLocaleString()} />
            <InfoItem icon={<User size={18} />} label="Created By" value={order.createdByFullName} />
            {order.approvedByFullName && (
               <InfoItem icon={<CheckCircle size={18} />} label="Approved By" value={order.approvedByFullName} />
            )}
          </div>

          {/* Items Table */}
          <div style={tableWrapperStyle}>
            <h3 style={tableTitleStyle}>Line Items</h3>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Product Name</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Quantity</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Unit Price</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item) => (
                  <tr key={item.id} style={trStyle}>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>{item.productName}</span>
                        <span style={{ fontSize: '12px', color: '#64748B' }}>{item.variantDetails}</span>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>LKR {item.unitPrice.toLocaleString()}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700 }}>LKR {item.subtotal.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Summary */}
          <div style={summaryStyle}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '32px' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#64748B', fontSize: '14px', fontWeight: 600 }}>Total Order Value</span>
                <p style={{ fontSize: '28px', fontWeight: 800, color: '#1D4ED8', margin: '4px 0 0 0' }}>
                  LKR {order.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <button onClick={onClose} style={doneButtonStyle}>Done</button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <div style={iconBoxStyle}>{icon}</div>
      <div>
        <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>{label}</p>
        <p style={{ fontSize: '15px', color: '#1E293B', margin: '2px 0 0 0', fontWeight: 600 }}>{value}</p>
      </div>
    </div>
  );
}

// Styles
const overlayStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)',
  backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px'
};

const modalStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF', width: '100%', maxWidth: '850px', borderRadius: '32px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column'
};

const headerStyle: React.CSSProperties = {
  padding: '24px 40px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0
};

const titleStyle: React.CSSProperties = {
  fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.5px'
};

const closeButtonStyle: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '8px', borderRadius: '12px', transition: 'background 0.2s'
};

const contentStyle: React.CSSProperties = { padding: '40px', overflowY: 'auto' };

const infoGridStyle: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '40px',
  paddingBottom: '40px', borderBottom: '1px solid #F1F5F9'
};

const iconBoxStyle: React.CSSProperties = {
  width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155'
};

const tableWrapperStyle: React.CSSProperties = { marginBottom: '40px' };

const tableTitleStyle: React.CSSProperties = { fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' };

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' };

const thStyle: React.CSSProperties = {
  padding: '12px 16px', fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', borderBottom: '2px solid #F1F5F9'
};

const tdStyle: React.CSSProperties = { padding: '16px', fontSize: '14px', color: '#1E293B', borderBottom: '1px solid #F8FAFC' };

const trStyle: React.CSSProperties = { transition: 'background 0.2s' };

const summaryStyle: React.CSSProperties = {
  backgroundColor: '#F8FAFC', padding: '32px', borderRadius: '24px', border: '1px solid #F1F5F9'
};

const footerStyle: React.CSSProperties = {
  padding: '24px 40px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end', flexShrink: 0
};

const doneButtonStyle: React.CSSProperties = {
  padding: '12px 32px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #1D4ED8, #2563EB)', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(29, 78, 216, 0.30)', transition: 'all 0.2s'
};
