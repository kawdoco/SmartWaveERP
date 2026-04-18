"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Users, Truck, ShieldCheck, Loader2 } from "lucide-react";
import { supplierApi, SupplierDTO } from "@/lib/api";
import SupplierTable from "@/components/suppliers/SupplierTable";
import SupplierModal from "@/components/suppliers/SupplierModal";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierDTO | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const data = await supplierApi.getAll();
      setSuppliers(data);
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedSupplier(null);
    setIsModalOpen(true);
  };

  const handleEdit = (supplier: SupplierDTO) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this supplier? This action cannot be undone.")) {
      try {
        await supplierApi.delete(id);
        fetchSuppliers();
      } catch (err: any) {
        alert("Error deleting supplier: " + err.message);
      }
    }
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && suppliers.length === 0) {
    return (
      <div style={loadingContainerStyle}>
        <Loader2 className="animate-spin" size={32} color="#0A2540" />
        <span style={{ fontWeight: 600, color: '#0A2540' }}>Loading Supplier Base...</span>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      {/* Header Section */}
      <div style={headerSectionStyle}>
        <div>
          <h1 style={titleStyle}>Supplier Management</h1>
          <p style={subtitleStyle}>Oversee your supply chain partners and industrial vendor details.</p>
        </div>
        <button onClick={handleCreate} style={addButtonStyle}>
          <Plus size={18} />
          <span>Register New Supplier</span>
        </button>
      </div>

      {/* Stats Cards Row */}
      <div style={statsRowStyle}>
        <StatCard 
          icon={<Users size={24} color="#0A2540" />} 
          label="Total Partners" 
          value={suppliers.length.toString()} 
          bgColor="#EFF6FF" 
        />
        <StatCard 
          icon={<Truck size={24} color="#059669" />} 
          label="Active Suppliers" 
          value={suppliers.length.toString()} 
          bgColor="#ECFDF5" 
        />
        <StatCard 
          icon={<ShieldCheck size={24} color="#7C3AED" />} 
          label="Verified Vendors" 
          value="100%" 
          bgColor="#F5F3FF" 
        />
      </div>

      {/* Table Section */}
      <div style={tableContainerStyle}>
        {/* Search Bar */}
        <div style={searchBarContainerStyle}>
          <div style={searchIconWrapperStyle}>
            <Search size={18} color="#94A3B8" />
          </div>
          <input 
            type="text" 
            placeholder="Search by name or contact person..." 
            style={searchInputStyle}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <SupplierTable 
          suppliers={filteredSuppliers} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </div>

      {/* Modal */}
      <SupplierModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchSuppliers} 
        supplier={selectedSupplier}
      />
    </div>
  );
}

// Sub-component: StatCard
function StatCard({ icon, label, value, bgColor }: { icon: React.ReactNode, label: string, value: string, bgColor: string }) {
  return (
    <div style={statCardStyle}>
      <div style={{ ...iconWrapperStyle, backgroundColor: bgColor }}>
        {icon}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={statLabelStyle}>{label}</span>
        <span style={statValueStyle}>{value}</span>
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
  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px'
};

const titleStyle: React.CSSProperties = {
  fontSize: '32px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.5px'
};

const subtitleStyle: React.CSSProperties = {
  color: '#64748B', fontSize: '15px', marginTop: '6px'
};

const addButtonStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
  backgroundColor: '#0A2540', color: '#FFFFFF', borderRadius: '12px',
  border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
};

const statsRowStyle: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px'
};

const statCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '20px',
  display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #F1F5F9',
  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
};

const iconWrapperStyle: React.CSSProperties = {
  width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'
};

const statLabelStyle: React.CSSProperties = { fontSize: '13px', fontWeight: 600, color: '#64748B' };

const statValueStyle: React.CSSProperties = { fontSize: '24px', fontWeight: 800, color: '#0F172A', marginTop: '2px' };

const tableContainerStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #F1F5F9', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
};

const searchBarContainerStyle: React.CSSProperties = {
  position: 'relative', marginBottom: '24px', maxWidth: '400px'
};

const searchIconWrapperStyle: React.CSSProperties = {
  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)'
};

const searchInputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px'
};

const loadingContainerStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '16px'
};
