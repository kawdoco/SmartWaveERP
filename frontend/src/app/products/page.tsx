"use client";

import React from 'react';
import { Search, Plus } from 'lucide-react';

export default function ProductCatalogPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F8FAFC",
        padding: "32px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#0F172A",
              margin: 0,
            }}
          >
            Product Catalog
          </h1>
          <p
            style={{
              color: "#64748B",
              fontSize: "16px",
              marginTop: "8px",
              marginBottom: 0,
            }}
          >
            Manage your clothing inventory items.
          </p>
        </div>
        
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#0A2540",
            color: "#FFFFFF",
            padding: "16px 24px",
            borderRadius: "16px",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "28px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "32px", borderBottom: "1px solid #E2E8F0" }}>
          <div style={{ position: "relative", width: "100%" }}>
            <div style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "#64748B", display: "flex" }}>
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search by name, barcode or brand..."
              style={{
                width: "100%",
                padding: "16px 20px 16px 52px",
                fontSize: "18px",
                borderRadius: "16px",
                border: "1px solid #1E293B",
                backgroundColor: "#FFFFFF",
                color: "#1E293B",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>
        </div>

        <div style={{ padding: "0 32px 32px 32px", backgroundColor: "#FFFFFF" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.5fr 1.5fr 1.5fr 1fr 1fr 1fr",
              fontSize: "14px",
              fontWeight: 600,
              textTransform: "uppercase",
              color: "#64748B",
              padding: "24px 0 16px 0",
              borderBottom: "1px solid #E2E8F0"
            }}
          >
            <p style={{ margin: 0 }}>PRODUCT</p>
            <p style={{ margin: 0 }}>BARCODE</p>
            <p style={{ margin: 0 }}>BRAND/CAT</p>
            <p style={{ margin: 0 }}>SIZE/COLOR</p>
            <p style={{ margin: 0 }}>PRICE</p>
            <p style={{ margin: 0 }}>STOCK</p>
            <p style={{ margin: 0 }}>STATUS</p>
          </div>
          
          {/* Empty state or placeholders can go here */}
          <div style={{ padding: "48px", textAlign: "center", color: "#94A3B8", fontSize: "16px" }}>
            No products to display.
          </div>
        </div>
      </div>
    </div>
  );
}
