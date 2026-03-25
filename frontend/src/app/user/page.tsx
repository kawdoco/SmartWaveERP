"use client";
import { Search, UserPlus } from "lucide-react";

import { useState } from "react";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

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
    },
    roleBadge: {
      backgroundColor: "#F1F5F9",
      padding: "5px 10px",
      borderRadius: "20px",
      fontSize: "12px",
    },

    /* MODAL */
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    modal: {
      backgroundColor: "#FFFFFF",
      borderRadius: "16px",
      padding: "30px",
      width: "400px",
    },
    modalTitle: {
      fontSize: "22px",
      fontWeight: "700",
      marginBottom: "20px",
    },
    label: {
      fontSize: "14px",
      marginBottom: "5px",
      display: "block",
    },
    inputField: {
      width: "100%",
      padding: "10px",
      marginBottom: "15px",
      borderRadius: "8px",
      border: "1px solid #E2E8F0",
    },
    buttonRow: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "10px",
    },
    cancelBtn: {
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #E2E8F0",
      background: "#FFFFFF",
      cursor: "pointer",
      width: "48%",
    },
    createBtn: {
      padding: "10px",
      borderRadius: "8px",
      border: "none",
      background: "#0A2540",
      color: "#FFFFFF",
      cursor: "pointer",
      width: "48%",
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

        <button
          style={styles.addButton}
          onClick={() => setShowModal(true)}
        >
          + Add User
        </button>
      </div>

      {/* CARD */}
      <div style={styles.card}>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search users..."
            style={styles.input}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={styles.tableHeader}>
          <div>FULL NAME</div>
          <div>USERNAME</div>
          <div>ROLE</div>
          <div>CREATED AT</div>
          <div>ACTIONS</div>
        </div>

        <div style={styles.row}>
          <div>System Administrator</div>
          <div>admin</div>
          <div>
            <span style={styles.roleBadge}>ADMIN</span>
          </div>
          <div>2/23/2026</div>
          <div>Edit</div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalTitle}>Add New User</div>

            <label style={styles.label}>Full Name</label>
            <input style={styles.inputField} />

            <label style={styles.label}>Username</label>
            <input style={styles.inputField} />

            <label style={styles.label}>Password</label>
            <input type="password" style={styles.inputField} />

            <label style={styles.label}>Role</label>
            <select style={styles.inputField}>
              <option>Admin</option>
              <option>Cashier</option>
            </select>

            <div style={styles.buttonRow}>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button style={styles.createBtn}>
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}