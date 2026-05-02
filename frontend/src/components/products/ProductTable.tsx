import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Package, Tag, Layers, ChevronDown, ChevronRight, PlusCircle, PenSquare, Trash } from "lucide-react";
import { ProductDTO, ProductVariantDTO, getStoredUser } from "@/lib/api";

interface ProductTableProps {
  products: ProductDTO[];
  onEdit: (product: ProductDTO) => void;
  onDelete: (id: number) => void;
  onAddVariant: (productId: number) => void;
  onEditVariant: (productId: number, variant: ProductVariantDTO) => void;
  onDeleteVariant: (variantId: number) => void;
}

export default function ProductTable({ products, onEdit, onDelete, onAddVariant, onEditVariant, onDeleteVariant }: ProductTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [isPrivileged, setIsPrivileged] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    const role = user?.role?.toUpperCase();
    setIsPrivileged(role === "ADMIN" || role === "MANAGER");
  }, []);

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedRows(newExpanded);
  };

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thStyle, width: '40px' }}></th>
            <th style={thStyle}>Master Product Identity</th>
            <th style={thStyle}>Classification</th>
            <th style={thStyle}>Variant Status</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Management Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((p) => {
              const isExpanded = expandedRows.has(p.id);
              const totalVariants = p.variants?.length || 0;

              return (
                <React.Fragment key={p.id}>
                  <tr style={trStyle}>
                    <td style={tdStyle}>
                      <button onClick={() => toggleExpand(p.id)} style={expandButtonStyle}>
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </button>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '15px' }}>{p.productName}</span>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8' }}>MODEL ID: #{p.id.toString().padStart(4, '0')}</span>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={tagRowStyle}>
                        <Tag size={12} color="#94A3B8" />
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>{p.category}</span>
                      </div>
                    </td>
                    <td style={tdStyle}>
                       <span style={badgeStyle}>{totalVariants} Types Available</span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                         <button onClick={() => toggleExpand(p.id)} style={{ ...actionButtonStyle, color: '#1D4ED8', backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }} title="View Varients">
                           <Layers size={16} /> 
                           <span style={{ fontSize: '12px', fontWeight: 700 }}>Options</span>
                         </button>
                         {isPrivileged && <button onClick={() => onAddVariant(p.id)} style={{ ...actionButtonStyle, color: '#2563EB' }} title="Add Varient"><PlusCircle size={16} /></button>}
                         {isPrivileged && <button onClick={() => onEdit(p)} style={actionButtonStyle} title="Edit Model"><Edit2 size={16} /></button>}
                         {isPrivileged && <button onClick={() => onDelete(p.id)} style={{ ...actionButtonStyle, color: '#EF4444' }} title="Delete Model"><Trash2 size={16} /></button>}
                      </div>
                    </td>
                  </tr>
                  
                  {isExpanded && (
                    <tr>
                      <td colSpan={6} style={{ padding: '0 0 24px 0' }}>
                        <div style={variantContainerStyle}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#1D4ED8' }}>Product Specifications</h4>
                            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>Commercial variants for {p.productName}</span>
                          </div>
                          <table style={variantTableStyle}>
                            <thead>
                              <tr>
                                <th style={vThStyle}>Brand</th>
                                <th style={vThStyle}>Colours</th>
                                <th style={vThStyle}>Dimensions / Size</th>
                                <th style={{ ...vThStyle, textAlign: 'right' }}>Standard Rate</th>
                                {isPrivileged && <th style={{ ...vThStyle, textAlign: 'right' }}>Actions</th>}
                              </tr>
                            </thead>
                            <tbody>
                              {p.variants?.map(v => (
                                <tr key={v.id} style={vTrStyle}>
                                  <td style={{ ...vTdStyle, fontWeight: 700, color: '#1D4ED8' }}>{v.brand}</td>
                                  <td style={vTdStyle}><span style={specBadgeStyle}>{v.color}</span></td>
                                  <td style={vTdStyle}><span style={{ ...specBadgeStyle, backgroundColor: '#FFFFFF' }}>{v.size}</span></td>
                                  <td style={{ ...vTdStyle, textAlign: 'right', fontWeight: 800, color: '#1D4ED8' }}>
                                    LKR {v.sellingPrice.toLocaleString()}
                                  </td>
                                  {isPrivileged && (
                                    <td style={{ ...vTdStyle, textAlign: 'right' }}>
                                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                        <button onClick={() => onEditVariant(p.id, v)} style={vActionButtonStyle} title="Edit Spec"><PenSquare size={13} /></button>
                                        <button onClick={() => onDeleteVariant(v.id)} style={{ ...vActionButtonStyle, color: '#EF4444' }} title="Delete Spec"><Trash size={13} /></button>
                                      </div>
                                    </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} style={{ padding: '64px', textAlign: 'center', color: '#94A3B8' }}>No products found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Styles
const containerStyle: React.CSSProperties = { overflowX: 'auto', borderRadius: '20px', border: '1px solid #F1F5F9', backgroundColor: '#FFFFFF' };
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' };
const thStyle: React.CSSProperties = { textAlign: 'left', padding: '18px 24px', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid #F8FAFC', backgroundColor: '#FAFBFC' };
const tdStyle: React.CSSProperties = { padding: '20px 24px', fontSize: '14px', color: '#1E293B', borderBottom: '1px solid #F8FAFC' };
const trStyle: React.CSSProperties = { transition: 'all 0.2s' };
const expandButtonStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center' };
const tagRowStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '6px' };
const badgeStyle: React.CSSProperties = { padding: '4px 10px', borderRadius: '8px', backgroundColor: '#F1F5F9', color: '#475569', fontSize: '11px', fontWeight: 700 };
const actionButtonStyle: React.CSSProperties = { padding: '8px', borderRadius: '8px', border: '1px solid #F1F5F9', backgroundColor: '#FFFFFF', cursor: 'pointer', color: '#64748B' };

// Variant Styles
const variantContainerStyle: React.CSSProperties = { margin: '0 24px 0 64px', backgroundColor: '#F9FAFB', borderRadius: '16px', border: '1px solid #F1F5F9', padding: '16px' };
const variantTableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' };
const vThStyle: React.CSSProperties = { textAlign: 'left', padding: '10px 16px', fontSize: '10px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' };
const vTdStyle: React.CSSProperties = { padding: '12px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #EDF2F7' };
const vTrStyle: React.CSSProperties = { backgroundColor: 'transparent' };
const specBadgeStyle: React.CSSProperties = { padding: '2px 6px', borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '10px', fontWeight: 600, color: '#475569' };
const vActionButtonStyle: React.CSSProperties = { background: 'none', border: 'none', padding: '4px', borderRadius: '4px', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' };
