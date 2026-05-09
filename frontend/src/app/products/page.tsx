"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Package, TrendingUp, AlertTriangle, Loader2, Upload } from "lucide-react";
import { productApi, ProductDTO } from "@/lib/api";
import ProductTable from "@/components/products/ProductTable";
import ProductModal from "@/components/products/ProductModal";
import ProductVariantModal from "@/components/products/ProductVariantModal";
import { ProductTableSkeleton } from "@/components/Skeleton";
import BulkUploadModal from "@/components/products/BulkUploadModal";

// Styling Imports
import { 
  pageStyle, 
  titleStyle 
} from "@/styles/sharedStyles";
import {
  headerSectionStyle,
  subtitleStyle,
  addButtonStyle,
  statsRowStyle,
  statCardStyle,
  statLabelStyle,
  statValueStyle,
  iconWrapperStyle,
  tableContainerStyle,
  searchBarContainerStyle,
  searchInputStyle
} from "@/styles/productStyles";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Model Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null);

  // Variant Modal
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);

  // Bulk Upload Modal
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productApi.getAll();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: ProductDTO) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Permanently remove this textile model and all its varients?")) {
      try {
        await productApi.delete(id);
        fetchProducts();
      } catch (err: any) { alert(err.message); }
    }
  };

  const handleAddVariant = (productId: number) => {
    setSelectedProductId(productId);
    setSelectedVariant(null);
    setIsVariantModalOpen(true);
  };

  const handleEditVariant = (productId: number, variant: any) => {
    setSelectedProductId(productId);
    setSelectedVariant(variant);
    setIsVariantModalOpen(true);
  };

  const handleDeleteVariant = async (variantId: number) => {
    if (confirm("Remove this specific stock variant?")) {
      try {
        await productApi.deleteVariant(variantId);
        fetchProducts();
      } catch (err: any) { alert(err.message); }
    }
  };

  const filteredProducts = products.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchesModel = (p.productName?.toLowerCase() ?? "").includes(q) ||
                         (p.category?.toLowerCase() ?? "").includes(q);
    
    const matchesVariant = p.variants?.some(v => 
      (v.barcode?.toLowerCase() ?? "").includes(q) ||
      (v.brand?.toLowerCase() ?? "").includes(q)
    );

    return matchesModel || matchesVariant;
  });

  // Stats
  const totalStockValue = products.reduce((acc, p) => 
    acc + (p.variants?.reduce((vAcc, v) => vAcc + (v.quantity * (v.purchasePrice || 0)), 0) || 0), 0
  );
  const lowStockCount = products.reduce((acc, p) => 
    acc + (p.variants?.filter(v => v.quantity < 10).length || 0), 0
  );

  return (
    <div style={pageStyle}>
      <div style={headerSectionStyle}>
        <div>
          <h1 style={titleStyle}>Textile Inventory Dashboard</h1>
          <h2 style={subtitleStyle}>Manage your hierarchical catalog of models and stock varients.</h2>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsBulkUploadModalOpen(true)} className="bg-[#1D4ED8] text-white hover:bg-[#1e40af] px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm">
            <Upload size={16} /> Bulk Upload
          </button>
          <button onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }} className="bg-[#1D4ED8] text-white hover:bg-[#1e40af] px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm">
            <Plus size={16} /> New Model
          </button>
        </div>
      </div>

      <div style={statsRowStyle}>
        <StatCard icon={<Package size={24} color="#0A2540" />} label="Master Models" value={loading ? "..." : products.length.toString()} accent="#EFF6FF" />
        <StatCard icon={<TrendingUp size={24} color="#059669" />} label="Total Stock Value" value={loading ? "LKR ..." : `LKR ${totalStockValue.toLocaleString()}`} accent="#ECFDF5" />
        <StatCard icon={<AlertTriangle size={24} color="#EF4444" />} label="Varient Alerts" value={loading ? "..." : lowStockCount.toString()} accent="#FEF2F2" />
      </div>

      <div style={tableContainerStyle}>
        <div style={searchBarContainerStyle}>
          <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '14px' }} />
          <input 
            style={searchInputStyle} 
            placeholder="Search by Varient Barcode, Name or Category..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
             <ProductTableSkeleton rows={5} />
        ) : (
            <ProductTable 
               products={filteredProducts} 
               onEdit={handleEdit} 
               onDelete={handleDelete} 
               onAddVariant={handleAddVariant}
               onEditVariant={handleEditVariant}
               onDeleteVariant={handleDeleteVariant}
            />
        )}
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchProducts} 
        product={selectedProduct} 
      />

      <ProductVariantModal 
        isOpen={isVariantModalOpen}
        onClose={() => setIsVariantModalOpen(false)}
        onSuccess={fetchProducts}
        productId={selectedProductId}
        variant={selectedVariant}
      />

      <BulkUploadModal 
        isOpen={isBulkUploadModalOpen} 
        onClose={() => setIsBulkUploadModalOpen(false)} 
        onSuccess={fetchProducts} 
      />
    </div>
  );
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode, label: string, value: string, accent: string }) {
  return (
    <div style={{ ...statCardStyle }}>
      <div style={{ ...iconWrapperStyle, backgroundColor: accent }}>{icon}</div>
      <div>
        <p style={statLabelStyle}>{label}</p>
        <p style={statValueStyle}>{value}</p>
      </div>
    </div>
  );
}

