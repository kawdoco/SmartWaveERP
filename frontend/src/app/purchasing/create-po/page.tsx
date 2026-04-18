"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Send, Loader2, Info, ShoppingCart } from "lucide-react";
import { supplierApi, procurementApi, productApi, ProductDTO, ProductVariantDTO } from "@/lib/api";
import { SkeletonPulse } from "@/components/Skeleton";

// Styling Imports
import { 
  pageStyle, 
  containerStyle, 
  backButtonStyle, 
  cardStyle, 
  titleStyle, 
  errorStyle, 
  fieldGroupStyle, 
  labelStyle, 
  inputStyle 
} from "@/styles/sharedStyles";
import {
  adderSectionStyle,
  sectionTitleStyle,
  adderGridStyle,
  subLabelStyle,
  addButtonStyle,
  tableStyle,
  thRowStyle,
  thStyle,
  tdStyle,
  trStyle,
  qtyInputStyle,
  specBadgeStyle,
  removeButtonStyle,
  totalRowStyle,
  footerStyle,
  submitButtonStyle
} from "@/styles/procurementStyles";

interface FlattenedVariant {
  id: number;
  label: string;
  productName: string;
  variantDetails: string;
  sellingPrice: number;
}

export default function CreatePurchaseOrderPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [availableVariants, setAvailableVariants] = useState<FlattenedVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [targetVariantId, setTargetVariantId] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sData, pData] = await Promise.all([
        supplierApi.getAll(),
        productApi.getAll()
      ]);
      setSuppliers(sData);
      
      // Flatten products into variants for single selection
      const flattened: FlattenedVariant[] = [];
      pData.forEach(p => {
        p.variants?.forEach(v => {
          flattened.push({
            id: v.id,
            productName: p.productName,
            variantDetails: `${v.brand} - ${v.color} - ${v.size}`,
            label: `${p.productName} [${v.brand} - ${v.color} - ${v.size}]`,
            sellingPrice: v.sellingPrice
          });
        });
      });
      setAvailableVariants(flattened);
    } catch (err: any) {
      setError("Synchronisation Error: Unable to fetch procurement metadata.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    if (!targetVariantId) return;
    
    const variant = availableVariants.find(v => v.id.toString() === targetVariantId);
    if (!variant) return;

    // Check if duplicate variant
    const existing = items.find(i => i.variantId === variant.id);
    if (existing) {
      setError("This variant is already in your ledger. Update the quantity instead.");
      return;
    }

    setItems([...items, {
      variantId: variant.id,
      productName: variant.productName,
      spec: variant.variantDetails,
      quantity: 1,
      unitPrice: variant.sellingPrice || 0,
    }]);

    setTargetVariantId("");
    setError(null);
  };

  const removeItem = (vId: number) => {
    setItems(items.filter(i => i.variantId !== vId));
  };

  const updateItem = (vId: number, fields: any) => {
    setItems(items.map(i => i.variantId === vId ? {...i, ...fields} : i));
  };

  const calculateTotal = () => {
    return items.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier || items.length === 0) {
      setError("Submission Blocked: Missing supplier or line items.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        supplierId: parseInt(selectedSupplier),
        items: items.map(i => ({
          variantId: i.variantId,
          quantity: i.quantity,
          unitPrice: i.unitPrice
        }))
      };
      await procurementApi.create(payload);
      router.push("/purchasing");
    } catch (err: any) {
      setError("Execution Error: " + (err.message || "Unknown database rejection."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        
        <Link href="/purchasing" style={backButtonStyle}><ArrowLeft size={18} /> Back to Procurement</Link>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
            <div>
              <h1 style={titleStyle}>Draft New Purchase Order</h1>
              <p style={{ color: '#64748B', fontSize: '14px' }}>Complete the manifest below to create a direct procurement request.</p>
            </div>
            <ShoppingCart size={32} color="#E2E8F0" />
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div style={errorStyle}><Info size={16} /> {error}</div>}

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Supplier Vendor / Source</label>
              {loading ? (
                <SkeletonPulse height="48px" borderRadius="14px" />
              ) : (
                <select required style={inputStyle} value={selectedSupplier} onChange={e => setSelectedSupplier(e.target.value)}>
                  <option value="" disabled>Search or Choose a supplier...</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              )}
            </div>

            <div style={adderSectionStyle}>
              <h3 style={sectionTitleStyle}>Procurement Items Manifest</h3>
              
              <div style={adderGridStyle}>
                <div style={{ flex: 1 }}>
                  <label style={subLabelStyle}>Global Variant Search</label>
                  {loading ? (
                    <SkeletonPulse height="48px" borderRadius="14px" />
                  ) : (
                    <select style={inputStyle} value={targetVariantId} onChange={e => setTargetVariantId(e.target.value)}>
                      <option value="" disabled>Type product name, brand, or color...</option>
                      {availableVariants.map(v => (
                        <option key={v.id} value={v.id}>{v.label}</option>
                      ))}
                    </select>
                  )}
                </div>

                <button type="button" onClick={addItem} style={addButtonStyle} disabled={loading || !targetVariantId}>
                   <Plus size={18} /> Add Item
                </button>
              </div>

              {/* Items Table */}
              <table style={tableStyle}>
                <thead>
                  <tr style={thRowStyle}>
                    <th style={thStyle}>Product / Model</th>
                    <th style={thStyle}>Varient Details</th>
                    <th style={thStyle}>Qty</th>
                    <th style={thStyle}>Price (LKR)</th>
                    <th style={thStyle}>Subtotal</th>
                    <th style={thStyle}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                        Manifest is empty. Search and add variants to begin.
                      </td>
                    </tr>
                  )}
                  {items.map(item => (
                    <tr key={item.variantId} style={trStyle}>
                      <td style={tdStyle}><span style={{ fontWeight: 700 }}>{item.productName}</span></td>
                      <td style={tdStyle}><span style={specBadgeStyle}>{item.spec}</span></td>
                      <td style={tdStyle}>
                        <input type="number" style={qtyInputStyle} value={item.quantity} onChange={e => updateItem(item.variantId, { quantity: Math.max(1, parseInt(e.target.value) || 0) })} />
                      </td>
                      <td style={tdStyle}>
                        <input type="number" style={qtyInputStyle} value={item.unitPrice} onChange={e => updateItem(item.variantId, { unitPrice: parseFloat(e.target.value) || 0 })} />
                      </td>
                      <td style={{ ...tdStyle, fontWeight: 800 }}>LKR {((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString()}</td>
                      <td style={tdStyle}>
                        <button type="button" onClick={() => removeItem(item.variantId)} style={removeButtonStyle}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {items.length > 0 && (
                <div style={totalRowStyle}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Grand Procurement Total</div>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: '#0A2540' }}>LKR {calculateTotal().toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>

            <div style={footerStyle}>
               <button type="submit" disabled={submitting || items.length === 0} style={submitButtonStyle}>
                 {submitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                 {submitting ? "Transmitting Ledger Data..." : "Finalise Purchase Order"}
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
