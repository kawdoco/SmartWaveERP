"use client";

import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Search,
  Eye,
  Check,
  Loader2,
  XCircle,
  FileText,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { procurementApi, PurchaseOrderResponse, getStoredUser } from "@/lib/api";

// ─── Status Badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const s = status.toUpperCase();
  const map: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    APPROVED: { bg: "bg-blue-50",    text: "text-blue-700",  dot: "bg-blue-500",   label: "Approved" },
    RECEIVED: { bg: "bg-green-50",   text: "text-green-700", dot: "bg-green-500",  label: "Received" },
    DRAFT:    { bg: "bg-slate-100",  text: "text-slate-600", dot: "bg-slate-400",  label: "Draft" },
    CANCELLED:{ bg: "bg-red-50",     text: "text-red-600",   dot: "bg-red-500",    label: "Cancelled" },
  };
  const style = map[s] ?? { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400", label: s };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}

// ─── Confirm Receive Modal ────────────────────────────────────────────────────
function ReceiveModal({
  order,
  onConfirm,
  onClose,
}: {
  order: PurchaseOrderResponse;
  onConfirm: (note: string) => void;
  onClose: () => void;
}) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(note);
    setLoading(false);
  };

  const formatLKR = (n: number) =>
    new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", minimumFractionDigits: 2 })
      .format(n).replace("LKR", "Rs.");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
            <Truck size={20} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Confirm Goods Receipt</h2>
            <p className="text-xs text-slate-400">PO #{String(order.id).padStart(5, "0")} — {order.supplierName}</p>
          </div>
        </div>

        {/* Items */}
        <div className="px-6 py-4 max-h-60 overflow-y-auto border-b border-slate-100 space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
              <div>
                <p className="text-sm font-semibold text-slate-800">{item.productName}</p>
                <p className="text-xs text-slate-400">{item.variantDetails}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#1D4ED8]">{item.quantity} units</p>
                <p className="text-xs text-slate-400">{formatLKR(item.unitPrice)} each</p>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery Note */}
        <div className="px-6 py-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
              Delivery Note / Remarks <span className="text-slate-300 font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#1D4ED8] text-sm resize-none"
              placeholder="e.g. Delivered in good condition, signed by warehouse staff..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg">
            <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 font-medium">
              Confirming receipt will mark this PO as <strong>RECEIVED</strong> and automatically update inventory stock levels.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              {loading ? "Processing…" : "Confirm Receipt"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── View Details Modal ───────────────────────────────────────────────────────
function DetailsModal({ order, onClose }: { order: PurchaseOrderResponse; onClose: () => void }) {
  const formatLKR = (n: number) =>
    new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", minimumFractionDigits: 2 })
      .format(n).replace("LKR", "Rs.");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">PO #{String(order.id).padStart(5, "0")}</h2>
            <p className="text-xs text-slate-400">{order.supplierName} · {new Date(order.poDate).toLocaleDateString()}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>
        <div className="px-6 py-4 max-h-80 overflow-y-auto space-y-2 border-b border-slate-100">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2.5 border-b border-slate-50 last:border-0">
              <div>
                <p className="text-sm font-semibold text-slate-800">{item.productName}</p>
                <p className="text-xs text-slate-400">{item.variantDetails}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#1D4ED8]">{item.quantity} × {formatLKR(item.unitPrice)}</p>
                <p className="text-xs text-slate-500 font-semibold">{formatLKR(item.subtotal)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Amount</p>
            <p className="text-lg font-black text-slate-900">{formatLKR(order.totalAmount)}</p>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1D4ED8] text-white rounded-lg font-medium text-sm hover:bg-[#1e40af] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main GRN Page ────────────────────────────────────────────────────────────
export default function GRNPage() {
  const [orders, setOrders] = useState<PurchaseOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "APPROVED" | "RECEIVED">("ALL");
  const [receiveTarget, setReceiveTarget] = useState<PurchaseOrderResponse | null>(null);
  const [viewTarget, setViewTarget] = useState<PurchaseOrderResponse | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isPrivileged, setIsPrivileged] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    const role = user?.role?.toUpperCase();
    setIsPrivileged(role === "ADMIN" || role === "MANAGER");
    fetchOrders();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await procurementApi.getAll();
      // GRN only cares about APPROVED and RECEIVED orders
      setOrders(data.filter((o) => o.status === "APPROVED" || o.status === "RECEIVED"));
    } catch (err: any) {
      setError(err.message || "Failed to load purchase orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleReceive = async (note: string) => {
    if (!receiveTarget) return;
    try {
      await procurementApi.updateStatus(receiveTarget.id, "RECEIVED");
      showToast(`✓ GRN confirmed for PO #${String(receiveTarget.id).padStart(5, "0")} — stock updated!`);
      setReceiveTarget(null);
      fetchOrders();
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
      setReceiveTarget(null);
    }
  };

  const formatLKR = (n: number) =>
    new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", minimumFractionDigits: 2 })
      .format(n).replace("LKR", "Rs.");

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      o.supplierName?.toLowerCase().includes(q) ||
      String(o.id).includes(q) ||
      o.createdByFullName?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // KPI Stats
  const approvedCount = orders.filter((o) => o.status === "APPROVED").length;
  const receivedCount = orders.filter((o) => o.status === "RECEIVED").length;
  const receivedValue = orders.filter((o) => o.status === "RECEIVED").reduce((s, o) => s + o.totalAmount, 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 mb-1">Goods Received Notes</h1>
          <p className="text-sm text-slate-500 font-medium">
            Confirm delivery of approved purchase orders and update stock levels.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="bg-[#1D4ED8] text-white hover:bg-[#1e40af] px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-5 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <ClipboardList size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Receipt</p>
            <p className="text-xl font-bold text-slate-900">{loading ? "…" : approvedCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-5 shadow-sm">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">GRNs Processed</p>
            <p className="text-xl font-bold text-slate-900">{loading ? "…" : receivedCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-5 shadow-sm">
          <div className="w-12 h-12 bg-[#EFF6FF] text-[#1D4ED8] rounded-xl flex items-center justify-center shrink-0">
            <Package size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Stock Received Value</p>
            <p className="text-xl font-bold text-slate-900">{loading ? "…" : formatLKR(receivedValue)}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by supplier, PO ID, or created by…"
              className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#1D4ED8] text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {(["ALL", "APPROVED", "RECEIVED"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  statusFilter === s
                    ? "bg-[#1D4ED8] text-white"
                    : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {s === "ALL" ? "All" : s === "APPROVED" ? "Pending" : "Received"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-16 gap-3 text-[#1D4ED8]">
            <Loader2 size={28} className="animate-spin" />
            <span className="font-semibold text-sm">Loading purchase orders…</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-16 gap-3 text-red-500">
            <XCircle size={40} className="text-red-300" />
            <p className="font-semibold text-sm">{error}</p>
            <button onClick={fetchOrders} className="px-4 py-2 bg-[#1D4ED8] text-white rounded-lg font-medium text-sm hover:bg-[#1e40af]">
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 gap-3 text-slate-400">
            <FileText size={48} className="opacity-30" />
            <p className="font-semibold text-sm">No GRN records found for current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-slate-100 bg-slate-50">
                  <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">PO #</th>
                  <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">PO Date</th>
                  <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Created By</th>
                  <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Total Value</th>
                  <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-slate-700 text-sm">
                        #{String(order.id).padStart(5, "0")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0">
                          <Truck size={13} className="text-[#1D4ED8]" />
                        </div>
                        <span className="text-sm font-semibold text-slate-800">{order.supplierName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(order.poDate).toLocaleDateString("en-LK", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{order.createdByFullName}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-slate-900 text-sm">{formatLKR(order.totalAmount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setViewTarget(order)}
                          title="View Items"
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <Eye size={13} /> View
                        </button>
                        {isPrivileged && order.status === "APPROVED" && (
                          <button
                            onClick={() => setReceiveTarget(order)}
                            title="Confirm Receipt"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Check size={13} /> Receive
                          </button>
                        )}
                        {order.status === "RECEIVED" && (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-green-700 bg-green-50 rounded-lg">
                            <CheckCircle2 size={13} /> Done
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {receiveTarget && (
        <ReceiveModal
          order={receiveTarget}
          onConfirm={handleReceive}
          onClose={() => setReceiveTarget(null)}
        />
      )}
      {viewTarget && (
        <DetailsModal order={viewTarget} onClose={() => setViewTarget(null)} />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 size={18} className="text-green-400 shrink-0" />
          {toast}
        </div>
      )}
    </div>
  );
}
