"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, Save } from "lucide-react";
import { SupplierDTO, supplierApi } from "@/lib/api";

/**
 * SupplierModal — A premium modal for adding or editing suppliers.
 * Includes form validation and loading states.
 */
interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  supplier?: SupplierDTO | null; // If provided, we are in EDIT mode
}

export default function SupplierModal({ isOpen, onClose, onSuccess, supplier }: SupplierModalProps) {
  const [formData, setFormData] = useState<Omit<SupplierDTO, 'id'>>({
    name: "",
    contactPerson: "",
    email: "",
    phoneNumber: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        contactPerson: supplier.contactPerson || "",
        email: supplier.email || "",
        phoneNumber: supplier.phoneNumber || "",
        address: supplier.address || ""
      });
    } else {
      setFormData({
        name: "",
        contactPerson: "",
        email: "",
        phoneNumber: "",
        address: ""
      });
    }
    setError(null);
  }, [supplier, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (supplier) {
        await supplierApi.update(supplier.id, formData);
      } else {
        await supplierApi.create(formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>{supplier ? 'Edit Supplier' : 'New Supplier'}</h2>
          <button onClick={onClose} style={closeButtonStyle}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={formStyle}>
          {error && <div style={errorStyle}>{error}</div>}

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Supplier Name *</label>
            <input
              required
              style={inputStyle}
              placeholder="e.g. Apex Textiles Ltd"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Contact Person</label>
            <input
              style={inputStyle}
              placeholder="e.g. John Doe"
              value={formData.contactPerson}
              onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
            />
          </div>

          <div style={rowStyle}>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                style={inputStyle}
                placeholder="vendor@example.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Phone Number</label>
              <input
                style={inputStyle}
                placeholder="+94 77..."
                value={formData.phoneNumber}
                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </div>
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Business Address</label>
            <textarea
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
              placeholder="Full street address..."
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          {/* Actions */}
          <div style={footerStyle}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={saveButtonStyle}>
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  <span>{supplier ? 'Update Supplier' : 'Save Supplier'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Styles
const overlayStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(15, 23, 42, 0.4)',
  backdropFilter: 'blur(4px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000, padding: '20px'
};

const modalStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  width: '100%', maxWidth: '500px',
  borderRadius: '24px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  overflow: 'hidden'
};

const headerStyle: React.CSSProperties = {
  padding: '24px 32px',
  borderBottom: '1px solid #F1F5F9',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
};

const titleStyle: React.CSSProperties = {
  fontSize: '20px', fontWeight: 700, color: '#0F172A', margin: 0
};

const closeButtonStyle: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8',
  padding: '4px', borderRadius: '8px', transition: 'background 0.2s'
};

const formStyle: React.CSSProperties = { padding: '32px' };

const fieldGroupStyle: React.CSSProperties = { marginBottom: '20px' };

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '13px', fontWeight: 600, color: '#64748B', marginBottom: '6px'
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0',
  fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'Inter, sans-serif'
};

const rowStyle: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'
};

const errorStyle: React.CSSProperties = {
  padding: '12px', borderRadius: '12px', backgroundColor: '#FEF2F2',
  color: '#DC2626', fontSize: '13px', marginBottom: '20px', border: '1px solid #FEE2E2'
};

const footerStyle: React.CSSProperties = {
  display: 'flex', gap: '16px', marginTop: '12px'
};

const cancelButtonStyle: React.CSSProperties = {
  flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0',
  backgroundColor: '#FFFFFF', color: '#475569', fontWeight: 600, cursor: 'pointer'
};

const saveButtonStyle: React.CSSProperties = {
  flex: 2, padding: '14px', borderRadius: '12px', border: 'none',
  backgroundColor: '#0A2540', color: '#FFFFFF', fontWeight: 600, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
};
