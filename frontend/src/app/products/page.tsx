"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Package, TrendingUp, AlertTriangle, Loader2, Upload, Layers } from "lucide-react";
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

  // Advanced Filtering
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL");

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

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  const filteredProducts = products.filter(p => {
    // 1. Search Query
    const q = searchQuery.toLowerCase();
    const matchesSearch = (p.productName?.toLowerCase() ?? "").includes(q) ||
                          (p.category?.toLowerCase() ?? "").includes(q) ||
                          p.variants?.some(v => 
                            (v.barcode?.toLowerCase() ?? "").includes(q) ||
                            (v.brand?.toLowerCase() ?? "").includes(q)
                          );
    
    // 2. Category Filter
    const matchesCategory = categoryFilter === "ALL" || p.category === categoryFilter;

    // 3. Stock Filter
    const totalStock = p.variants?.reduce((sum, v) => sum + v.quantity, 0) || 0;
    let matchesStock = true;
    if (stockFilter === "IN_STOCK") matchesStock = totalStock > 0;
    if (stockFilter === "LOW_STOCK") matchesStock = totalStock > 0 && totalStock < 10;
    if (stockFilter === "OUT_OF_STOCK") matchesStock = totalStock === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Stats
  const totalProducts = products.length;
  const totalItems = products.reduce((acc, p) => acc + (p.variants?.length || 0), 0);
  const lowStockCount = products.reduce((acc, p) => 
    acc + (p.variants?.filter(v => v.quantity < 10).length || 0), 0
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 mb-1">Textile Inventory Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium">Manage your hierarchical catalog of models and stock variants.</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<Package size={20} className="text-[#0A2540]" />} label="Total Products" value={loading ? "..." : totalProducts.toString()} accent="#EFF6FF" />
        <StatCard icon={<Layers size={20} className="text-[#1D4ED8]" />} label="Total Items (SKUs)" value={loading ? "..." : totalItems.toString()} accent="#EEF2FF" />
        <StatCard icon={<AlertTriangle size={20} className="text-[#EF4444]" />} label="Low Stock Alerts" value={loading ? "..." : lowStockCount.toString()} accent="#FEF2F2" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by barcode, name, brand or category..." 
              className="w-full pl-12 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-[#1D4ED8] text-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="w-full lg:w-48">
            <select 
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#1D4ED8] text-sm font-semibold text-slate-600 cursor-pointer appearance-none"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Stock Status Filter */}
          <div className="w-full lg:w-48">
            <select 
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#1D4ED8] text-sm font-semibold text-slate-600 cursor-pointer appearance-none"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="ALL">All Stock Status</option>
              <option value="IN_STOCK">In Stock</option>
              <option value="LOW_STOCK">Low Stock (&lt;10)</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-0 overflow-hidden">

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
    <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-5 shadow-sm transition-all hover:shadow-md">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: accent }}>{icon}</div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

