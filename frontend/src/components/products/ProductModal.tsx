"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, Save, Barcode, Tag, Briefcase } from "lucide-react";
import { ProductDTO, productApi } from "@/lib/api";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: ProductDTO | null;
}

export default function ProductModal({ isOpen, onClose, onSuccess, product }: ProductModalProps) {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName,
        category: product.category,
      });
    } else {
      setFormData({ productName: "", category: "" });
    }
  }, [product, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (product) {
        await productApi.update(product.id, formData);
      } else {
        await productApi.create({ ...formData, variants: [] });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>{product ? 'Edit Model' : 'Register New Model'}</h2>
          <button onClick={onClose} style={closeButtonStyle}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          {error && <div style={errorStyle}>{error}</div>}

          <div style={fieldGroupStyle}>
            <label style={labelStyle}><Briefcase size={14} /> Model Name *</label>
            <input required style={inputStyle} value={formData.productName} onChange={e => setFormData({ ...formData, productName: e.target.value })} placeholder="e.g. Premium Cotton Jersey" />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}><Tag size={14} /> Category *</label>
            <input required style={inputStyle} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. T-Shirts" />
          </div>

          <div style={{ marginTop: '24px' }}>
            <button type="submit" disabled={loading} style={saveButtonStyle}>
              {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Update Model</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 };
const modalStyle: React.CSSProperties = { backgroundColor: '#FFFFFF', width: '100%', maxWidth: '450px', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' };
const headerStyle: React.CSSProperties = { padding: '24px 32px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const titleStyle: React.CSSProperties = { fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 };
const closeButtonStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' };
const formStyle: React.CSSProperties = { padding: '32px' };
const fieldGroupStyle: React.CSSProperties = { marginBottom: '20px' };
const labelStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#64748B', marginBottom: '8px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none' };
const errorStyle: React.CSSProperties = { padding: '12px', borderRadius: '12px', backgroundColor: '#FEF2F2', color: '#DC2626', marginBottom: '20px' };
const saveButtonStyle: React.CSSProperties = { width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #1D4ED8, #2563EB)', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(29, 78, 216, 0.30)', transition: 'all 0.2s' };
