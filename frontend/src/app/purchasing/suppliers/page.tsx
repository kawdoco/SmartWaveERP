"use client";

import Link from "next/link";
import { Plus, X } from "lucide-react";
import { useState } from "react";

type SupplierItem = {
  id: number;
  supplierName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  state: string;
  city: string;
  country: string;
};

export default function SuppliersPage() {
  const [showModal, setShowModal] = useState(false);
  const [suppliers, setSuppliers] = useState<SupplierItem[]>([]);

  const [formData, setFormData] = useState({
    supplierName: "",
    contactPerson: "",
    email: "",
    phoneNumber: "",
    state: "",
    city: "",
    country: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateSupplier = () => {
    const newSupplier: SupplierItem = {
      id: Date.now(),
      ...formData,
    };

    setSuppliers((prev) => [...prev, newSupplier]);

    setFormData({
      supplierName: "",
      contactPerson: "",
      email: "",
      phoneNumber: "",
      state: "",
      city: "",
      country: "",
    });

    setShowModal(false);
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Suppliers</h1>
          <p style={subTextStyle}>Manage supplier records.</p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/purchasing" style={backBtn}>
            Back
          </Link>

          <button onClick={() => setShowModal(true)} style={addSupplierBtn}>
            <Plus size={18} />
            <span>Add Supplier</span>
          </button>
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={cardTitle}>Supplier List</h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
              <th style={thStyle}>Supplier Name</th>
              <th style={thStyle}>Contact Person</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Phone Number</th>
              <th style={thStyle}>City</th>
            </tr>
          </thead>

          <tbody>
            {suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <tr key={supplier.id} style={rowStyle}>
                  <td style={tdStyle}>{supplier.supplierName}</td>
                  <td style={tdStyle}>{supplier.contactPerson}</td>
                  <td style={tdStyle}>{supplier.email}</td>
                  <td style={tdStyle}>{supplier.phoneNumber}</td>
                  <td style={tdStyle}>{supplier.city}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={emptyStyle}>
                  No suppliers available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={overlayStyle} onClick={() => setShowModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeader}>
              <h2 style={modalTitleStyle}>Add Supplier</h2>
              <button
                onClick={() => setShowModal(false)}
                style={closeButtonStyle}
              >
                <X size={20} />
              </button>
            </div>

            <div style={formGrid}>
              <Input
                label="Supplier Name"
                name="supplierName"
                value={formData.supplierName}
                onChange={handleChange}
              />

              <Input
                label="Contact Person"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
              />

              <div style={twoCol}>
                <Input
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Input
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>

              <div style={threeCol}>
                <Input
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
                <Input
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={btnGrid}>
              <button onClick={() => setShowModal(false)} style={modalCancelBtn}>
                Cancel
              </button>

              <button onClick={handleCreateSupplier} style={modalCreateBtn}>
                Create Supplier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({
  label,
  ...props
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input {...props} style={inputStyle} />
    </div>
  );
}

const containerStyle = {
  minHeight: "100vh",
  backgroundColor: "#F8FAFC",
  padding: "32px",
  fontFamily: "Arial, sans-serif",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "30px",
  gap: "20px",
  flexWrap: "wrap" as const,
};

const titleStyle = {
  fontSize: "40px",
  fontWeight: "700",
  color: "#0F172A",
  margin: 0,
};

const subTextStyle = {
  color: "#64748B",
  marginTop: "8px",
};

const cardStyle = {
  background: "#FFFFFF",
  padding: "20px",
  borderRadius: "20px",
  border: "1px solid #E2E8F0",
};

const cardTitle = {
  fontSize: "20px",
  marginBottom: "10px",
  marginTop: 0,
  color: "#0F172A",
};

const thStyle = {
  textAlign: "left" as const,
  color: "#64748B",
  padding: "10px 0",
  fontSize: "13px",
  textTransform: "uppercase" as const,
};

const tdStyle = {
  padding: "12px 0",
  color: "#0F172A",
  fontSize: "15px",
};

const rowStyle = {
  borderBottom: "1px solid #E2E8F0",
};

const emptyStyle = {
  textAlign: "center" as const,
  padding: "20px",
  color: "#64748B",
};

const overlayStyle = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  zIndex: 1000,
};

const modalStyle = {
  background: "#FFFFFF",
  padding: "28px",
  borderRadius: "24px",
  width: "100%",
  maxWidth: "720px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
};

const modalHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
};

const modalTitleStyle = {
  margin: 0,
  fontSize: "24px",
  fontWeight: 700,
  color: "#0F172A",
};

const closeButtonStyle = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  color: "#64748B",
};

const formGrid = {
  display: "grid",
  gap: "14px",
};

const twoCol = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "14px",
};

const threeCol = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "14px",
};

const btnGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
  marginTop: "28px",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "15px",
  fontWeight: 600,
  color: "#0F172A",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #E2E8F0",
  fontSize: "15px",
  color: "#0F172A",
  backgroundColor: "#FFFFFF",
  boxSizing: "border-box" as const,
};

const backBtn = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "92px",
  height: "52px",
  padding: "0 20px",
  borderRadius: "12px",
  border: "1px solid #E2E8F0",
  backgroundColor: "#FFFFFF",
  color: "#0F172A",
  textDecoration: "none",
  fontSize: "16px",
  fontWeight: 500,
  boxSizing: "border-box" as const,
};

const addSupplierBtn = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  minWidth: "150px",
  height: "52px",
  padding: "0 20px",
  borderRadius: "12px",
  border: "none",
  backgroundColor: "#0A2540",
  color: "#FFFFFF",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: 500,
  boxSizing: "border-box" as const,
};

const modalCancelBtn = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #E2E8F0",
  padding: "14px 18px",
  borderRadius: "12px",
  cursor: "pointer",
  color: "#0F172A",
  fontSize: "16px",
  fontWeight: 500,
};

const modalCreateBtn = {
  backgroundColor: "#0A2540",
  color: "#FFFFFF",
  padding: "14px 18px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: 500,
};