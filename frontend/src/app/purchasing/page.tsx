"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Users, FileText, Loader2, RefreshCw, TrendingUp } from "lucide-react";
import { procurementApi, PurchaseOrderResponse, supplierApi, SupplierDTO } from "@/lib/api";
import PurchaseOrderTable from "@/components/purchasing/PurchaseOrderTable";
import PurchaseOrderDetailsModal from "@/components/purchasing/PurchaseOrderDetailsModal";

/**
 * ProcurementPage — The central hub for purchasing operations.
 * Fetches real-time PO data and provides a high-level overview of the supply chain.
 */
export default function ProcurementPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderResponse[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Pagination State
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Detail Modal State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrderResponse | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [posData, suppliersData] = await Promise.all([
        procurementApi.getAll(),
        supplierApi.getAll()
      ]);
      setPurchaseOrders(posData);
      setSuppliers(suppliersData);
    } catch (err: any) {
      setError(err.message || "Failed to load procurement data");
    } finally {
      setLoading(false);
    }
  };

  // --- LIFECYCLE HANDLERS ---
  const handleApprove = async (id: number) => {
    try {
      await procurementApi.updateStatus(id, "APPROVED");
      fetchData();
    } catch (err: any) { alert(err.message); }
  };

  const handleReceive = async (id: number) => {
    try {
      await procurementApi.updateStatus(id, "RECEIVED");
      fetchData();
    } catch (err: any) { alert(err.message); }
  };

  const handleCancel = async (id: number) => {
    if (confirm("Cancel this Purchase Order?")) {
      try {
        await procurementApi.updateStatus(id, "CANCELLED");
        fetchData();
      } catch (err: any) { alert(err.message); }
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await procurementApi.updateStatus(id, "DRAFT");
      fetchData();
    } catch (err: any) { alert(err.message); }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this record permanently?")) {
      try {
        await procurementApi.delete(id);
        fetchData();
      } catch (err: any) { alert(err.message); }
    }
  };

  const handleViewDetails = (order: PurchaseOrderResponse) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  // --- FILTERING & PAGINATION LOGIC ---
  const filteredOrders = purchaseOrders.filter(po => 
    statusFilter === "ALL" ? true : po.status.toUpperCase() === statusFilter
  );

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Stats calculation
  const totalInvestment = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);
  const draftOrders = purchaseOrders.filter(po => po.status === 'DRAFT').length;

  if (loading && purchaseOrders.length === 0) {
    return (
      <div style={loadingContainerStyle}>
        <Loader2 className="animate-spin" size={32} color="#0A2540" />
        <span style={{ fontWeight: 600, color: '#0A2540' }}>Synchronizing Procurement Module...</span>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      {/* Header Container */}
      <div style={headerSectionStyle}>
        <div>
          <h1 style={titleStyle}>Procurement Dashboard</h1>
          <p style={subtitleStyle}>Industrial grade supply chain management and purchase order tracking.</p>
        </div>

        <div style={actionButtonGroupStyle}>
          <button onClick={fetchData} style={secondaryButtonStyle} title="Refresh Data">
            <RefreshCw size={18} />
          </button>
          
          <Link href="/purchasing/suppliers" style={secondaryButtonStyle}>
            <Users size={18} />
            <span>Manage Suppliers</span>
          </Link>

          <Link href="/purchasing/create-po" style={primaryButtonStyle}>
            <Plus size={18} />
            <span>New Purchase Order</span>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div style={statsRowStyle}>
        <StatCard 
          icon={<TrendingUp size={24} color="#0A2540" />} 
          label="Total Procurement Value" 
          value={`LKR ${totalInvestment.toLocaleString()}`} 
          accent="#EFF6FF"
        />
        <StatCard 
          icon={<FileText size={24} color="#7C3AED" />} 
          label="Draft Orders" 
          value={draftOrders.toString()} 
          accent="#F5F3FF"
        />
        <StatCard 
          icon={<Users size={24} color="#059669" />} 
          label="Vetted Suppliers" 
          value={suppliers.length.toString()} 
          accent="#ECFDF5"
        />
      </div>

      {/* Content Section */}
      <div style={contentContainerStyle}>
        {error ? (
          <div style={errorBannerStyle}>
            <p><strong>Connection Error:</strong> {error}</p>
            <button onClick={fetchData} style={retryButtonStyle}>Retry Connection</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={tableTitleStyle}>Master Ledger: Purchase Orders</h2>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>Filter:</span>
                <select 
                  style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '13px' }}
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="DRAFT">Draft Only</option>
                  <option value="APPROVED">Approved Only</option>
                  <option value="RECEIVED">Received Only</option>
                  <option value="CANCELLED">Cancelled Only</option>
                </select>
              </div>
            </div>
            
            <PurchaseOrderTable 
              orders={paginatedOrders} 
              onView={handleViewDetails}
              onApprove={handleApprove}
              onReceive={handleReceive}
              onCancel={handleCancel}
              onRestore={handleRestore}
              onDelete={handleDelete}
            />

            {/* Pagination Footer */}
            {totalPages > 1 && (
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: currentPage === i + 1 ? '#0A2540' : '#FFFFFF',
                      color: currentPage === i + 1 ? '#FFFFFF' : '#0A2540',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      <PurchaseOrderDetailsModal 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}

// Sub-component: StatCard
function StatCard({ icon, label, value, accent }: { icon: React.ReactNode, label: string, value: string, accent: string }) {
  return (
    <div style={statCardStyle}>
      <div style={{ ...iconBoxStyle, backgroundColor: accent }}>
        {icon}
      </div>
      <div>
        <p style={statLabelStyle}>{label}</p>
        <p style={statValueStyle}>{value}</p>
      </div>
    </div>
  );
}

// Styles
const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#F8FAFC",
  padding: "40px",
  fontFamily: "Inter, sans-serif",
};

const headerSectionStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px'
};

const titleStyle: React.CSSProperties = {
  fontSize: '32px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.8px'
};

const subtitleStyle: React.CSSProperties = {
  color: '#64748B', fontSize: '15px', marginTop: '6px'
};

const actionButtonGroupStyle: React.CSSProperties = {
  display: 'flex', gap: '12px'
};

const primaryButtonStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
  backgroundColor: '#0A2540', color: '#FFFFFF', borderRadius: '12px',
  border: 'none', fontWeight: 600, cursor: 'pointer', textDecoration: 'none',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
};

const secondaryButtonStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
  backgroundColor: '#FFFFFF', color: '#0F172A', borderRadius: '12px',
  border: '1px solid #E2E8F0', fontWeight: 600, cursor: 'pointer', textDecoration: 'none',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
};

const statsRowStyle: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '40px'
};

const statCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '24px',
  display: 'flex', alignItems: 'center', gap: '24px', border: '1px solid #F1F5F9',
  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
};

const iconBoxStyle: React.CSSProperties = {
  width: '64px', height: '64px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center'
};

const statLabelStyle: React.CSSProperties = { fontSize: '13px', fontWeight: 600, color: '#64748B', margin: 0 };

const statValueStyle: React.CSSProperties = { fontSize: '24px', fontWeight: 800, color: '#0F172A', marginTop: '4px', margin: 0 };

const contentContainerStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #F1F5F9', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
};

const tableTitleStyle: React.CSSProperties = {
  fontSize: '20px', fontWeight: 700, color: '#0F172A', margin: 0
};

const errorBannerStyle: React.CSSProperties = {
  padding: '32px', textAlign: 'center', color: '#DC2626', backgroundColor: '#FEF2F2', borderRadius: '16px', border: '1px solid #FEE2E2'
};

const retryButtonStyle: React.CSSProperties = {
  marginTop: '16px', padding: '8px 24px', borderRadius: '8px', border: '1px solid #DC2626',
  backgroundColor: '#FFFFFF', color: '#DC2626', fontWeight: 600, cursor: 'pointer'
};

const loadingContainerStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '16px'
};
};