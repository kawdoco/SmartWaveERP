"use client";
import { Search, UserPlus } from "lucide-react";

import { useState } from "react";

export default function UsersPage() {
  const [search, setSearch] = useState("");

  const styles = {
    page: {
      padding: "40px",
      backgroundColor: "#F8FAFC",
      minHeight: "100vh",
      fontFamily: "sans-serif",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "25px",
    },
    title: {
      fontSize: "32px",
      fontWeight: "700",
      color: "#0F172A",
      marginBottom: "5px",
    },
    subtitle: {
      color: "#64748B",
      fontSize: "14px",
    },
    addButton: {
      backgroundColor: "#0A2540",
      color: "#FFFFFF",
      padding: "10px 18px",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      fontWeight: "500",
    },
    card: {
      backgroundColor: "#FFFFFF",
      borderRadius: "14px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      border: "1px solid #E2E8F0",
    },
    searchBox: {
      padding: "15px",
      borderBottom: "1px solid #E2E8F0",
    },
    input: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #E2E8F0",
      outline: "none",
      fontSize: "14px",
    },
    tableHeader: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
      padding: "15px",
      fontSize: "13px",
      color: "#64748B",
      fontWeight: "600",
    },
    row: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
      padding: "15px",
      borderTop: "1px solid #E2E8F0",
      alignItems: "center",
    },
    roleBadge: {
      backgroundColor: "#F1F5F9",
      color: "#0F172A",
      padding: "5px 10px",
      borderRadius: "20px",
      fontSize: "12px",
      display: "inline-block",
      fontWeight: "500",
    },
    action: {
      color: "#0A2540",
      cursor: "pointer",
      fontWeight: "500",
    },
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <div style={styles.title}>User Management</div>
          <div style={styles.subtitle}>
            Manage system access and roles.
          </div>
        </div>

        <button style={styles.addButton}>+ Add User</button>
      </div>

      {/* CARD */}
      <div style={styles.card}>
        {/* SEARCH */}
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search users..."
            style={styles.input}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE HEADER */}
        <div style={styles.tableHeader}>
          <div>FULL NAME</div>
          <div>USERNAME</div>
          <div>ROLE</div>
          <div>CREATED AT</div>
          <div>ACTIONS</div>
        </div>

        {/* ROW */}
        <div style={styles.row}>
          <div style={{ fontWeight: "600", color: "#0F172A" }}>
            System Administrator
          </div>
          <div style={{ color: "#64748B" }}>admin</div>
          <div>
            <span style={styles.roleBadge}>ADMIN</span>
          </div>
          <div style={{ color: "#64748B" }}>2/23/2026</div>
          <div style={styles.action}>Edit</div>
        </div>
      </div>
    </div>
  );
}