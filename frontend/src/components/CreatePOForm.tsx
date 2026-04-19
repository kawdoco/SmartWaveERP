"use client";

import React, { useState, useEffect } from "react";

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

type Supplier = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
};

interface CreatePOFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePOForm({ isOpen, onClose }: CreatePOFormProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/suppliers`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setSuppliers(data))
        .catch((err) => console.error("Error fetching suppliers:", err));

      fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/products`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setProducts(data))
        .catch((err) => console.error("Error fetching products:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        zIndex: 9999,
        padding: "32px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "28px",
          padding: "40px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#0F172A",
            margin: 0,
            marginBottom: "40px",
          }}
        >
          Create Purchase Order
        </h1>

        <div style={{ marginBottom: "40px" }}>
          <label
            style={{
              display: "block",
              fontSize: "20px",
              fontWeight: 600,
              color: "#0F172A",
              marginBottom: "12px",
            }}
          >
            Select Supplier
          </label>

          <select
            style={{
              width: "100%",
              padding: "16px 20px",
              fontSize: "18px",
              borderRadius: "16px",
              border: "1px solid #1E293B",
              backgroundColor: "#FFFFFF",
              color: "#1E293B",
              outline: "none",
            }}
            defaultValue=""
          >
            <option value="" disabled>
              Choose a supplier...
            </option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            marginBottom: "48px",
            border: "1px solid #1E293B",
            borderRadius: "24px",
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#0F172A",
                margin: 0,
              }}
            >
              Order Items
            </h2>

            <select
              style={{
                padding: "10px 16px",
                borderRadius: "12px",
                border: "1px solid #1E293B",
                fontSize: "16px",
                backgroundColor: "#FFFFFF",
                color: "#1E293B",
              }}
              defaultValue=""
            >
              <option value="" disabled>
                Add Product...
              </option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              borderTop: "1px solid #E2E8F0",
              padding: "16px 20px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                fontSize: "14px",
                fontWeight: 600,
                textTransform: "uppercase",
                color: "#64748B",
              }}
            >
              <p style={{ margin: 0 }}>Product</p>
              <p style={{ margin: 0 }}>Qty</p>
              <p style={{ margin: 0 }}>Unit Price</p>
              <p style={{ margin: 0 }}>Total</p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              textAlign: "center",
              padding: "18px",
              borderRadius: "16px",
              border: "1px solid #1E293B",
              backgroundColor: "#FFFFFF",
              color: "#0F172A",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
