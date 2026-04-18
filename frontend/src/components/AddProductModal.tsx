import React from 'react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  if (!isOpen) return null;

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    fontSize: "15px",
    borderRadius: "12px",
    border: "1px solid #CBD5E1",
    outline: "none",
    boxSizing: "border-box" as const,
    color: "#1E293B",
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: 600,
    color: "#0F172A",
    marginBottom: "8px",
  };

  const formSectionStyle = {
    marginBottom: "20px",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ padding: "32px 32px 24px 32px", borderBottom: "1px solid #E2E8F0" }}>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: "#0F172A" }}>
            Add New Product
          </h2>
        </div>

        <div style={{ padding: "32px", overflowY: "auto", flex: 1 }}>
          
          <div style={formSectionStyle}>
            <label style={labelStyle}>Product Name</label>
            <input type="text" style={inputStyle} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", ...formSectionStyle }}>
            <div>
              <label style={labelStyle}>Barcode</label>
              <input type="text" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Brand</label>
              <input type="text" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "24px", ...formSectionStyle }}>
            <div>
              <label style={labelStyle}>Category</label>
              <input type="text" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Size</label>
              <input type="text" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Color</label>
              <input type="text" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", ...formSectionStyle }}>
            <div>
              <label style={labelStyle}>Selling Price</label>
              <input type="number" defaultValue="0" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Cost Price</label>
              <input type="number" defaultValue="0" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", ...formSectionStyle }}>
            <div>
              <label style={labelStyle}>Min Stock Level</label>
              <input type="number" defaultValue="5" style={inputStyle} />
            </div>
            <div></div>
          </div>

        </div>

        <div style={{ 
          padding: "24px 32px", 
          borderTop: "1px solid #E2E8F0", 
          display: "flex", 
          justifyContent: "center", 
          gap: "16px",
          backgroundColor: "#F8FAFC",
          borderBottomLeftRadius: "24px",
          borderBottomRightRadius: "24px"
        }}>
          <button
            onClick={onClose}
            style={{
              padding: "16px 32px",
              borderRadius: "16px",
              border: "1px solid #1E293B",
              backgroundColor: "#FFFFFF",
              color: "#0F172A",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              minWidth: "160px",
            }}
          >
            Cancel
          </button>
          
          <button
            style={{
              padding: "16px 32px",
              borderRadius: "16px",
              border: "none",
              backgroundColor: "#0A2540",
              color: "#FFFFFF",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              minWidth: "160px",
            }}
          >
            Save Product
          </button>
        </div>

      </div>
    </div>
  );
}
