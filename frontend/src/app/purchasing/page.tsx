import Link from "next/link";
import { Plus, UserPlus } from "lucide-react";

export default function ProcurementPage() {
  const purchaseOrders: {
    id: string;
    supplier: string;
    total: string;
    status: string;
    date: string;
  }[] = [];

  const suppliers: {
    id: string;
    name: string;
  }[] = [];

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
          alignItems: "flex-start",
          marginBottom: "32px",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "700",
              color: "#0F172A",
              margin: 0,
            }}
          >
            Procurement
          </h1>

          <p
            style={{
              marginTop: "8px",
              fontSize: "18px",
              color: "#64748B",
            }}
          >
            Manage suppliers and purchase orders.
          </p>
        </div>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 18px",
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              backgroundColor: "#FFFFFF",
              color: "#0F172A",
              cursor: "pointer",
            }}
          >
            <UserPlus size={18} />
            Add Supplier
          </button>

          <Link
            href="/purchasing/create-po"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 18px",
              borderRadius: "12px",
              backgroundColor: "#0A2540",
              color: "#FFFFFF",
              textDecoration: "none",
            }}
          >
            <Plus size={18} />
            Create PO
          </Link>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "24px",
        }}
      >
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "20px",
            padding: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#0F172A",
              marginBottom: "20px",
            }}
          >
            Recent Purchase Orders
          </h2>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
                <th style={thStyle}>PO ID</th>
                <th style={thStyle}>Supplier</th>
                <th style={thStyle}>Total</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {purchaseOrders.length > 0 ? (
                purchaseOrders.map((po) => (
                  <tr key={po.id} style={rowStyle}>
                    <td style={tdStyle}>{po.id}</td>
                    <td style={tdStyle}>{po.supplier}</td>
                    <td style={tdStyle}>{po.total}</td>
                    <td style={tdStyle}>{po.status}</td>
                    <td style={tdStyle}>{po.date}</td>
                    <td
                      style={{
                        ...tdStyle,
                        color: "#0A2540",
                        cursor: "pointer",
                      }}
                    >
                      View
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "24px 0",
                      textAlign: "center",
                      color: "#64748B",
                      fontSize: "15px",
                    }}
                  >
                    No purchase orders available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "20px",
            padding: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#0F172A",
              marginBottom: "10px",
            }}
          >
            Suppliers
          </h2>

          {suppliers.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {suppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  style={{
                    padding: "12px",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    color: "#0F172A",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  {supplier.name}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#64748B" }}>
              No suppliers added yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left" as const,
  padding: "12px 0",
  fontSize: "13px",
  color: "#64748B",
  textTransform: "uppercase" as const,
};

const tdStyle = {
  padding: "14px 0",
  fontSize: "15px",
  color: "#0F172A",
};

const rowStyle = {
  borderBottom: "1px solid #E2E8F0",
};