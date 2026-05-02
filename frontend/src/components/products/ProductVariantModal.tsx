"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, Save, ShoppingBag, ShieldCheck, ShieldAlert, Wand2 } from "lucide-react";
import { ProductVariantDTO, productApi, getStoredUser } from "@/lib/api";

interface VariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productId: number | null;
  variant?: ProductVariantDTO | null;
}

export default function ProductVariantModal({ isOpen, onClose, onSuccess, productId, variant }: VariantModalProps) {
  const [formData, setFormData] = useState<Omit<ProductVariantDTO, 'id'>>({
    brand: "",
    barcode: "",
    size: "",
    color: "",
    purchasePrice: 0,
    sellingPrice: 0,
    quantity: 0,
    status: "ACTIVE"
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPrivileged, setIsPrivileged] = useState(false);

  useEffect(() => {
    // Check role from stored user
    const user = getStoredUser();
    const role = user?.role?.toUpperCase();
    setIsPrivileged(role === "ADMIN" || role === "MANAGER");

    if (variant) {
      setFormData({
        brand: variant.brand || "",
        barcode: variant.barcode || "",
        size: variant.size || "",
        color: variant.color || "",
        purchasePrice: variant.purchasePrice,
        sellingPrice: variant.sellingPrice,
        quantity: variant.quantity,
        status: variant.status
      });
    } else {
      setFormData({
        brand: "", barcode: "", size: "", color: "",
        purchasePrice: 0, sellingPrice: 0, quantity: 0, status: "ACTIVE"
      });
    }
  }, [variant, isOpen]);

  const generateBarcode = () => {
    // 12-digit random numerical barcode
    const newBarcode = Math.floor(Math.random() * 900000000000) + 100000000000;
    setFormData({ ...formData, barcode: newBarcode.toString() });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;
    setLoading(true);
    setError(null);
    try {
      if (variant?.id) {
          await productApi.updateVariant(variant.id, formData);
      } else {
          await productApi.addVariant(productId, formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while saving the variant.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={titleStyle}><ShoppingBag size={20} /> {variant ? 'Edit' : 'Register'} Product Varient</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                {isPrivileged ? <ShieldCheck size={12} color="#10B981" /> : <ShieldAlert size={12} color="#F59E0B" />}
                <span style={{ fontSize: '10px', fontWeight: 700, color: isPrivileged ? '#10B981' : '#F59E0B', textTransform: 'uppercase' }}>
                    {isPrivileged ? 'Elevated Access Granted' : 'Restricted Viewing Mode'}
                </span>
            </div>
          </div>
          <button onClick={onClose} style={closeButtonStyle}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          {error && <div style={errorStyle}>{error}</div>}

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Variant Barcode / SKU *</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                  required 
                  type="number"
                  style={{ ...inputStyle, backgroundColor: !isPrivileged ? '#F8FAFC' : '#FFFFFF', flex: 1 }} 
                  value={formData.barcode} 
                  onChange={e => setFormData({ ...formData, barcode: e.target.value.replace(/\D/g, '') })} 
                  placeholder="Scan or type numerical barcode..." 
                  disabled={!isPrivileged}
              />
              {isPrivileged && (
                <button 
                  type="button" 
                  onClick={generateBarcode}
                  style={{ padding: '0 16px', borderRadius: '12px', border: '1px solid #1D4ED8', backgroundColor: '#EFF6FF', color: '#1D4ED8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                  title="Auto-Generate Barcode"
                >
                  <Wand2 size={18} />
                </button>
              )}
            </div>
          </div>

          <div style={rowStyle}>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Brand / Manufacturer</label>
              <input style={inputStyle} value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} placeholder="e.g. Levi's" />
            </div>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Operational Status</label>
              <select 
                style={{ ...inputStyle, backgroundColor: !isPrivileged ? '#F8FAFC' : '#FFFFFF' }} 
                value={formData.status} 
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                disabled={!isPrivileged}
              >
                <option value="ACTIVE">Active (In Rotation)</option>
                <option value="INACTIVE">Inactive (Hidden)</option>
              </select>
            </div>
          </div>

          <div style={rowStyle}>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Size Specification</label>
              <input style={inputStyle} value={formData.size} onChange={e => setFormData({ ...formData, size: e.target.value })} placeholder="e.g. XL or 32" />
            </div>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Colour / Finish</label>
              <input style={inputStyle} value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} placeholder="e.g. Midnight Blue" />
            </div>
          </div>

          <div style={rowStyle}>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Acquisition Price (LKR)</label>
              <input 
                type="number" 
                style={{ ...inputStyle, backgroundColor: !isPrivileged ? '#F8FAFC' : '#FFFFFF' }} 
                value={formData.purchasePrice} 
                onChange={e => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })} 
                disabled={!isPrivileged}
              />
            </div>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Retail Selling Price (LKR)</label>
              <input type="number" style={inputStyle} value={formData.sellingPrice} onChange={e => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })} />
            </div>
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Initial Stock Inventory Count</label>
            <input 
                type="number" 
                style={{ ...inputStyle, backgroundColor: !isPrivileged ? '#F8FAFC' : '#FFFFFF' }} 
                value={formData.quantity} 
                onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })} 
                disabled={!isPrivileged}
                placeholder="Current quantities are managed in Inventory section"
            />
            {!isPrivileged && <p style={{ fontSize: '10px', color: '#94A3B8', marginTop: '4px', fontStyle: 'italic' }}>* Quantities must be updated via official Procurement or Inventory channels.</p>}
          </div>

          <div style={footerStyle}>
             <button type="submit" disabled={loading} style={saveButtonStyle}>
                {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> {variant ? 'Save Changes' : 'Register Varient'}</>}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Styles
const overlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 };
const modalStyle: React.CSSProperties = { backgroundColor: '#FFFFFF', width: '100%', maxWidth: '500px', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' };
const headerStyle: React.CSSProperties = { padding: '20px 32px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const titleStyle: React.CSSProperties = { fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' };
const closeButtonStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' };
const formStyle: React.CSSProperties = { padding: '32px' };
const rowStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
const fieldGroupStyle: React.CSSProperties = { marginBottom: '20px' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none' };
const errorStyle: React.CSSProperties = { padding: '12px', borderRadius: '12px', backgroundColor: '#FEF2F2', color: '#DC2626', fontSize: '12px', marginBottom: '20px' };
const footerStyle: React.CSSProperties = { marginTop: '12px' };
const saveButtonStyle: React.CSSProperties = { width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #1D4ED8, #2563EB)', color: '#FFFFFF', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(29, 78, 216, 0.30)', transition: 'all 0.2s' };
