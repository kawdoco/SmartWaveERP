"use client";

/**
 * User Management Page — /user
 *
 * CHANGES vs the original:
 *
 * 1. REMOVED all hardcoded demo data (the single hardcoded "System Administrator" row).
 *
 * 2. ADDED real data fetching — on mount, `userApi.getAll()` is called to load
 *    the user list from the backend (GET /api/users).
 *
 * 3. ADD USER modal now calls `authApi.register()` (POST /auth/register) to create
 *    the user in the database. The list is refreshed automatically after success.
 *    All four roles from the backend Role enum are available in the dropdown.
 *    Added Email field (required by the register endpoint).
 *
 * 4. EDIT ROLE — a role dropdown appears inline per row and calls
 *    `userApi.changeRole()` (PATCH /api/users/:id/role) on change.
 *
 * 5. TOGGLE STATUS — the "Active / Inactive" badge is now a clickable button that
 *    calls `userApi.toggleStatus()` (PATCH /api/users/:id/toggle-status).
 *
 * 6. DELETE — the "Delete" action calls `userApi.delete()` (DELETE /api/users/:id)
 *    with a confirmation prompt.
 *
 * 7. LOADING, ERROR, and SUCCESS feedback banners are shown for each operation.
 *
 * 8. Search filtering now works against live data (fullName, username, email, role).
 *
 * UI styles are preserved exactly as they were in the original file.
 */

import { useState, useEffect, useCallback } from "react";
import { userApi, authApi, UserDTO, getStoredUser } from "@/lib/api"; 
import { UserTableSkeleton, ButtonSkeleton } from "@/components/Skeleton"; // NEW: Skeleton components

// ── Role constants (mirrors backend Role enum) ────────────────────────────────
const ROLES = ["ADMIN", "MANAGER", "CASHIER", "INVENTORY_CLERK"] as const;
type Role = typeof ROLES[number];

// ── Role badge colours ────────────────────────────────────────────────────────
const ROLE_COLOURS: Record<string, { bg: string; text: string }> = {
  ADMIN:            { bg: "#FEF3C7", text: "#92400E" },
  MANAGER:          { bg: "#DBEAFE", text: "#1E40AF" },
  CASHIER:          { bg: "#D1FAE5", text: "#065F46" },
  INVENTORY_CLERK:  { bg: "#EDE9FE", text: "#5B21B6" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function roleBadgeStyle(role: string) {
  const colours = ROLE_COLOURS[role] ?? { bg: "#F1F5F9", text: "#334155" };
  return {
    backgroundColor: colours.bg,
    color: colours.text,
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 600,
    display: "inline-block",
  };
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function UsersPage() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [users, setUsers] = useState<UserDTO[]>([]);       // CHANGE: live data
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);            // CHANGE: loading state
  const [error, setError] = useState<string | null>(null); // CHANGE: error state
  const [success, setSuccess] = useState<string | null>(null); // CHANGE: success feedback
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null); // NEW: for role gating

  // Check if current user has management permissions
  const canManage = currentUserRole === "ADMIN" || currentUserRole === "MANAGER";

  // Add-user modal state
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "", username: "", email: "", password: "", role: "CASHIER",
  });

  // Edit-user modal state
  // editTarget holds the user being edited; null means the modal is closed.
  const [editTarget, setEditTarget] = useState<UserDTO | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "", email: "", role: "CASHIER",
  });

  /** Open the Edit modal and pre-fill the form with the selected user's data. */
  function openEdit(user: UserDTO) {
    setEditTarget(user);
    setEditForm({ fullName: user.fullName, email: user.email, role: user.role });
    setError(null);
  }

  /** Close the Edit modal and clear state. */
  function closeEdit() {
    setEditTarget(null);
    setError(null);
  }

  // ── Fetch users from backend ───────────────────────────────────────────────
  /**
   * CHANGE: loadUsers() calls userApi.getAll() instead of using hardcoded data.
   * Wrapped in useCallback so it can be called after mutations too.
   */
  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userApi.getAll();
      setUsers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    loadUsers(); 
    // NEW: Get current user role on mount
    const user = getStoredUser();
    if (user) setCurrentUserRole(user.role);
  }, [loadUsers]); // fetch on mount

  // ── Filtered list (client-side search against live data) ──────────────────
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  // ── Flash helper ──────────────────────────────────────────────────────────
  function flash(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  }

  // ── Add User ──────────────────────────────────────────────────────────────
  /**
   * CHANGE: Calls authApi.register() (POST /auth/register) and reloads the list.
   */
  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    setModalLoading(true);
    setError(null);
    try {
      await authApi.register({
        username: form.username,
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        role: form.role,
      });
      setShowModal(false);
      setForm({ fullName: "", username: "", email: "", password: "", role: "CASHIER" });
      await loadUsers();
      flash("User created successfully.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create user.");
    } finally {
      setModalLoading(false);
    }
  }

  // ── Change Role ───────────────────────────────────────────────────────────
  /**
   * CHANGE: Calls userApi.changeRole() (PATCH /api/users/:id/role).
   * Updates the local list optimistically then confirms with the server response.
   */
  async function handleRoleChange(id: number, newRole: string) {
    setError(null);
    try {
      const updated = await userApi.changeRole(id, newRole);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      flash(`Role updated to ${newRole}.`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to change role.");
    }
  }

  // ── Toggle Active Status ──────────────────────────────────────────────────
  /**
   * CHANGE: Calls userApi.toggleStatus() (PATCH /api/users/:id/toggle-status).
   */
  async function handleToggleStatus(id: number) {
    setError(null);
    try {
      const updated = await userApi.toggleStatus(id);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      flash(`User ${updated.isActive ? "activated" : "deactivated"}.`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to toggle status.");
    }
  }

  // ── Edit User ─────────────────────────────────────────────────────────────
  /**
   * Calls userApi.update() (PUT /api/users/:id) with the edited fields.
   * Username is not editable (it's the login key; backend doesn't update it here).
   * Updates the local list with the server-returned updated user object.
   */
  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editTarget) return;
    setEditLoading(true);
    setError(null);
    try {
      const updated = await userApi.update(editTarget.id, {
        fullName: editForm.fullName,
        email: editForm.email,
        role: editForm.role as UserDTO["role"],
        // pass through existing values the backend requires
        isActive: editTarget.isActive,
      });
      // Replace the row in local state with the updated user from the server
      setUsers((prev) => prev.map((u) => (u.id === editTarget.id ? updated : u)));
      closeEdit();
      flash("User updated successfully.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update user.");
    } finally {
      setEditLoading(false);
    }
  }

  // ── Delete User ───────────────────────────────────────────────────────────
  /**
   * CHANGE: Calls userApi.delete() (DELETE /api/users/:id) after confirmation.
   */
  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    setError(null);
    try {
      await userApi.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      flash("User deleted.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete user.");
    }
  }

  // ── Styles (original styles preserved, minor additions for new elements) ───
  const styles = {
    page: {
      padding: "40px",
      backgroundColor: "#F8FAFC",
      minHeight: "100vh",
      fontFamily: "sans-serif",
    } as React.CSSProperties,
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "25px",
    } as React.CSSProperties,
    title: { fontSize: "32px", fontWeight: "700", color: "#0F172A" } as React.CSSProperties,
    subtitle: { color: "#64748B", fontSize: "14px" } as React.CSSProperties,
    addButton: {
      backgroundColor: "#0A2540",
      color: "#FFFFFF",
      padding: "10px 18px",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      fontWeight: 600,
    } as React.CSSProperties,
    card: {
      backgroundColor: "#FFFFFF",
      borderRadius: "14px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      border: "1px solid #E2E8F0",
    } as React.CSSProperties,
    searchBox: { padding: "15px", borderBottom: "1px solid #E2E8F0" } as React.CSSProperties,
    input: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #E2E8F0",
      fontSize: "14px",
      boxSizing: "border-box",
    } as React.CSSProperties,
    tableHeader: {
      display: "grid",
      gridTemplateColumns: "2fr 1.2fr 1.2fr 1fr 1.4fr 1fr",
      padding: "12px 15px",
      fontSize: "12px",
      color: "#64748B",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    } as React.CSSProperties,
    row: {
      display: "grid",
      gridTemplateColumns: canManage ? "2fr 1.2fr 1.2fr 1fr 1.4fr 1fr" : "2fr 1.2fr 1.2fr 1fr 1.4fr",
      padding: "14px 15px",
      borderTop: "1px solid #F1F5F9",
      alignItems: "center",
      fontSize: "14px",
    } as React.CSSProperties,
    /* MODAL */
    overlay: {
      position: "fixed",
      top: 0, left: 0,
      width: "100%", height: "100%",
      backgroundColor: "rgba(0,0,0,0.45)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    } as React.CSSProperties,
    modal: {
      backgroundColor: "#FFFFFF",
      borderRadius: "16px",
      padding: "32px",
      width: "440px",
      boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
    } as React.CSSProperties,
    modalTitle: { fontSize: "20px", fontWeight: "700", marginBottom: "24px", color: "#0F172A" } as React.CSSProperties,
    label: { fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "5px", display: "block" } as React.CSSProperties,
    inputField: {
      width: "100%",
      padding: "10px 12px",
      marginBottom: "14px",
      borderRadius: "8px",
      border: "1px solid #E2E8F0",
      fontSize: "14px",
      boxSizing: "border-box",
    } as React.CSSProperties,
    buttonRow: { display: "flex", justifyContent: "space-between", marginTop: "10px", gap: "12px" } as React.CSSProperties,
    cancelBtn: {
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #E2E8F0",
      background: "#FFFFFF",
      cursor: "pointer",
      flex: 1,
      fontSize: "14px",
    } as React.CSSProperties,
    createBtn: {
      padding: "10px",
      borderRadius: "8px",
      border: "none",
      background: "#0A2540",
      color: "#FFFFFF",
      cursor: "pointer",
      flex: 1,
      fontSize: "14px",
      fontWeight: 600,
    } as React.CSSProperties,
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div style={styles.header}>
        <div>
          <div style={styles.title}>User Management</div>
          <div style={styles.subtitle}>Manage system access and roles.</div>
        </div>
        {currentUserRole === null ? (
          <ButtonSkeleton width="120px" />
        ) : (
          canManage && (
            <button style={styles.addButton} onClick={() => setShowModal(true)}>
              + Add User
            </button>
          )
        )}
      </div>

      {/* ── Global feedback banners ────────────────────────────────────────── */}
      {/* CHANGE: error and success banners — shown for load errors and mutations */}
      {error && (
        <div style={{
          marginBottom: "16px", padding: "12px 16px",
          backgroundColor: "#FEF2F2", border: "1px solid #FECACA",
          borderRadius: "10px", color: "#B91C1C", fontSize: "14px",
          display: "flex", justifyContent: "space-between",
        }}>
          {error}
          <button onClick={() => setError(null)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#B91C1C", fontWeight: 700 }}>
            ✕
          </button>
        </div>
      )}
      {success && (
        <div style={{
          marginBottom: "16px", padding: "12px 16px",
          backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0",
          borderRadius: "10px", color: "#15803D", fontSize: "14px",
        }}>
          ✓ {success}
        </div>
      )}

      {/* ── User Table Card ────────────────────────────────────────────────── */}
      <div style={styles.card}>

        {/* Search */}
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search by name, username, email or role…"
            style={styles.input}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table header */}
        <div style={styles.tableHeader}>
          <div>Full Name</div>
          <div>Username</div>
          <div>Email</div>
          <div>Status</div>
          <div>Role</div>
          {canManage && <div>Actions</div>}
        </div>

        {/* ── CHANGE: Loading skeleton ─────────────────────────────────────── */}
        {loading && (
          <UserTableSkeleton canManage={canManage} rows={6} />
        )}

        {/* ── CHANGE: Empty state ────────────────────────────────────────────*/}
        {!loading && filtered.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "#94A3B8", fontSize: "14px" }}>
            {search ? "No users match your search." : "No users found."}
          </div>
        )}

        {/* ── CHANGE: Live data rows ─────────────────────────────────────── */}
        {!loading && filtered.map((user) => (
          <div key={user.id} style={{
            ...styles.row,
            /* dim inactive rows */
            opacity: user.isActive ? 1 : 0.55,
            /* ADJUST COLUMNS BASED ON PERMISSIONS */
            gridTemplateColumns: canManage ? "2fr 1.2fr 1.2fr 1fr 1.4fr 1fr" : "2fr 1.2fr 1.2fr 1fr 1.4fr",
          }}>

            {/* Full name */}
            <div style={{ fontWeight: 600, color: "#0F172A" }}>{user.fullName}</div>

            {/* Username */}
            <div style={{ color: "#475569" }}>@{user.username}</div>

            {/* Email */}
            <div style={{ color: "#475569", fontSize: "13px" }}>{user.email}</div>

            {/* Status toggle — CHANGE: clickable button calls toggleStatus API */}
            <div>
              <button
                onClick={() => canManage && handleToggleStatus(user.id)}
                title={canManage ? "Click to toggle active status" : "Status (view-only)"}
                style={{
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: canManage ? "pointer" : "default",
                  border: "none",
                  backgroundColor: user.isActive ? "#D1FAE5" : "#FEE2E2",
                  color: user.isActive ? "#065F46" : "#991B1B",
                }}
              >
                {user.isActive ? "Active" : "Inactive"}
              </button>
            </div>

            {/* Role dropdown — CHANGE: calls changeRole API on change */}
            <div>
              <select
                value={user.role}
                onChange={(e) => canManage && handleRoleChange(user.id, e.target.value)}
                disabled={!canManage}
                style={{
                  padding: "4px 8px",
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  fontSize: "12px",
                  backgroundColor: ROLE_COLOURS[user.role]?.bg ?? "#F1F5F9",
                  color: ROLE_COLOURS[user.role]?.text ?? "#334155",
                  fontWeight: 600,
                  cursor: canManage ? "pointer" : "default",
                  appearance: canManage ? "auto" : "none", // hide arrow if read-only
                }}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r.replace("_", " ")}</option>
                ))}
              </select>
            </div>

            {/* Actions — Edit + Delete (ONLY FOR ADMIN/MANAGER) */}
            {canManage && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {/* Edit button */}
                <button
                  onClick={() => openEdit(user)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "7px",
                    border: "1px solid #BFDBFE",
                    backgroundColor: "#EFF6FF",
                    color: "#1D4ED8",
                    fontSize: "12px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Edit
                </button>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(user.id, user.fullName)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "7px",
                    border: "1px solid #FECACA",
                    backgroundColor: "#FEF2F2",
                    color: "#B91C1C",
                    fontSize: "12px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Add User Modal ──────────────────────────────────────────────────── */}
      {/* CHANGE: form now posts to backend via authApi.register() */}
      {showModal && (
        <div style={styles.overlay} onClick={() => !modalLoading && setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>Add New User</div>

            <form onSubmit={handleAddUser}>
              <label style={styles.label}>Full Name</label>
              <input
                required
                style={styles.inputField}
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="e.g. Jane Smith"
              />

              <label style={styles.label}>Username</label>
              <input
                required
                style={styles.inputField}
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="e.g. jane_smith"
              />

              {/* CHANGE: Email field added (required by POST /auth/register) */}
              <label style={styles.label}>Email</label>
              <input
                required
                type="email"
                style={styles.inputField}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jane@smartwave.com"
              />

              <label style={styles.label}>Password</label>
              <input
                required
                type="password"
                style={styles.inputField}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 6 characters"
                minLength={6}
              />

              {/* CHANGE: All four backend roles listed */}
              <label style={styles.label}>Role</label>
              <select
                style={styles.inputField}
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r.replace("_", " ")}</option>
                ))}
              </select>

              {/* CHANGE: Modal-level error (e.g. "Username already taken") */}
              {error && (
                <div style={{
                  marginBottom: "12px", padding: "10px 14px",
                  backgroundColor: "#FEF2F2", border: "1px solid #FECACA",
                  borderRadius: "8px", color: "#B91C1C", fontSize: "13px",
                }}>
                  {error}
                </div>
              )}

              <div style={styles.buttonRow}>
                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={() => { setShowModal(false); setError(null); }}
                  disabled={modalLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ ...styles.createBtn, opacity: modalLoading ? 0.7 : 1 }}
                  disabled={modalLoading}
                >
                  {modalLoading ? "Creating…" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ── Edit User Modal ─────────────────────────────────────────────────── */}
      {editTarget && (
        <div style={styles.overlay} onClick={() => !editLoading && closeEdit()}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

            {/* Modal header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div style={styles.modalTitle}>Edit User</div>
              <button
                onClick={closeEdit}
                disabled={editLoading}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#94A3B8" }}
              >
                ✕
              </button>
            </div>

            {/* Read-only username badge */}
            <div style={{ marginBottom: "16px", padding: "10px 12px", backgroundColor: "#F8FAFC", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
              <span style={{ fontSize: "12px", color: "#94A3B8", fontWeight: 600 }}>USERNAME (read-only)</span>
              <div style={{ fontSize: "14px", color: "#475569", marginTop: "2px" }}>@{editTarget.username}</div>
            </div>

            <form onSubmit={handleEditSubmit}>

              <label style={styles.label}>Full Name</label>
              <input
                required
                style={styles.inputField}
                value={editForm.fullName}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                placeholder="Full name"
                disabled={editLoading}
              />

              <label style={styles.label}>Email</label>
              <input
                required
                type="email"
                style={styles.inputField}
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                placeholder="email@smartwave.com"
                disabled={editLoading}
              />

              <label style={styles.label}>Role</label>
              <select
                style={styles.inputField}
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                disabled={editLoading}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r.replace("_", " ")}</option>
                ))}
              </select>

              {/* Modal-level error */}
              {error && (
                <div style={{
                  marginBottom: "12px", padding: "10px 14px",
                  backgroundColor: "#FEF2F2", border: "1px solid #FECACA",
                  borderRadius: "8px", color: "#B91C1C", fontSize: "13px",
                }}>
                  {error}
                </div>
              )}

              <div style={styles.buttonRow}>
                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={closeEdit}
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ ...styles.createBtn, opacity: editLoading ? 0.7 : 1 }}
                  disabled={editLoading}
                >
                  {editLoading ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}