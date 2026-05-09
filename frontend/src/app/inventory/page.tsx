"use client";

import React, { useState, useEffect } from 'react';
import { productApi, ProductDTO, ProductVariantDTO, getStoredUser } from '@/lib/api';
import { 
  Package, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Loader2,
  Barcode as BarcodeIcon,
  Printer
} from 'lucide-react';

// --- Types ---
interface FlattenedVariant extends ProductVariantDTO {
  parentProductId: number;
  parentProductName: string;
  parentCategory: string;
}

export default function InventoryPage() {
  const [variants, setVariants] = useState<FlattenedVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  
  // Derived Data
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const products = await productApi.getAll();
      
      const flatVariants: FlattenedVariant[] = [];
      const uniqueCategories = new Set<string>();

      products.forEach(product => {
        uniqueCategories.add(product.category.toUpperCase());
        if (product.variants) {
          product.variants.forEach(variant => {
            flatVariants.push({
              ...variant,
              parentProductId: product.id,
              parentProductName: product.productName,
              parentCategory: product.category
            });
          });
        }
      });

      setVariants(flatVariants);
      setCategories(Array.from(uniqueCategories));
    } catch (err: any) {
      setError(err.message || 'Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintBarcode = (variant: FlattenedVariant) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const html = `
      <html>
        <head>
          <style>
            @page { margin: 0; size: auto; }
            body { font-family: sans-serif; width: 40mm; text-align: center; margin: 0 auto; padding: 5px; }
            .name { font-size: 10px; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
            .price { font-size: 12px; font-weight: bold; margin-top: 2px; }
            svg { max-width: 100%; height: auto; }
          </style>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
        </head>
        <body>
          <div class="name">${variant.parentProductName}</div>
          <svg id="barcode"></svg>
          <div class="price">Rs. ${variant.sellingPrice}</div>
          <script>
            window.onload = () => {
              JsBarcode("#barcode", "${variant.barcode}", {
                width: 1.5,
                height: 30,
                displayValue: true,
                fontSize: 10,
                margin: 0
              });
              setTimeout(() => { window.print(); window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // --- Filtering Logic ---
  const filteredVariants = variants.filter(v => {
    // 1. Search Filter (Barcode, Name, Brand, Size, Color)
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      v.barcode.toLowerCase().includes(searchLower) ||
      v.parentProductName.toLowerCase().includes(searchLower) ||
      (v.brand && v.brand.toLowerCase().includes(searchLower)) ||
      (v.color && v.color.toLowerCase().includes(searchLower)) ||
      (v.size && v.size.toLowerCase().includes(searchLower));
    
    if (!matchesSearch) return false;

    // 2. Category Filter
    if (categoryFilter !== 'ALL' && v.parentCategory.toUpperCase() !== categoryFilter) {
      return false;
    }

    // 3. Stock Level Filter
    if (stockFilter === 'IN_STOCK' && v.quantity <= 0) return false;
    if (stockFilter === 'OUT_OF_STOCK' && v.quantity > 0) return false;
    if (stockFilter === 'LOW_STOCK' && (v.quantity <= 0 || v.quantity > 10)) return false; // Assuming < 10 is low stock

    return true;
  });

  // --- KPI Calculations ---
  const totalItems = variants.length;
  const totalStockQty = variants.reduce((acc, v) => acc + v.quantity, 0);
  const lowStockItems = variants.filter(v => v.quantity > 0 && v.quantity <= 10).length;
  const outOfStockItems = variants.filter(v => v.quantity <= 0).length;

  const formatLKR = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
    }).format(amount).replace('LKR', 'Rs.');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-[#f8fafc] text-[#1D4ED8] gap-4">
        <Loader2 className="animate-spin" size={32} />
        <span className="font-bold">Loading Inventory Master List...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-[#f8fafc] text-red-500 gap-4 p-8 text-center">
        <XCircle size={48} className="text-red-400 mb-2" />
        <h2 className="text-xl font-bold text-slate-800">Connection Error</h2>
        <p className="text-sm text-slate-500 max-w-md">{error}</p>
        <button 
          onClick={fetchInventory}
          className="mt-4 px-4 py-2 bg-[#1D4ED8] text-white rounded-lg font-medium text-sm hover:bg-[#1e40af] transition-colors shadow-sm"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8fafc] p-6 lg:p-10 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 mb-1">Inventory Ledger</h1>
          <p className="text-sm text-slate-500 font-medium">Real-time stock tracking across all product variants.</p>
        </div>
        <button className="bg-[#1D4ED8] text-white hover:bg-[#1e40af] px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-[#EFF6FF] text-[#1D4ED8] rounded-xl flex items-center justify-center shrink-0">
            <Package size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total SKUs</p>
            <p className="text-2xl font-bold text-slate-900">{totalItems}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Stock on Hand</p>
            <p className="text-2xl font-bold text-slate-900">{totalStockQty}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
            <AlertTriangle size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Low Stock</p>
            <p className="text-2xl font-bold text-slate-900">{lowStockItems}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>
          <div className="w-14 h-14 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0">
            <XCircle size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Out of Stock</p>
            <p className="text-2xl font-bold text-red-600">{outOfStockItems}</p>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row gap-4 justify-between items-center bg-slate-50">
          
          <div className="relative w-full lg:w-96">
            <div className="absolute inset-y-0 left-4 flex items-center text-slate-400">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search barcode, name, brand, color..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-[#1D4ED8] transition-all text-sm font-medium"
            />
          </div>

          <div className="flex w-full lg:w-auto gap-4">
            <div className="relative flex-1 lg:w-48">
              <div className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                <Filter size={16} />
              </div>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1D4ED8] appearance-none text-sm font-bold text-slate-600 cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <select 
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="flex-1 lg:w-48 px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1D4ED8] text-sm font-bold text-slate-600 cursor-pointer"
            >
              <option value="ALL">All Stock Levels</option>
              <option value="IN_STOCK">In Stock (&gt; 0)</option>
              <option value="LOW_STOCK">Low Stock (1 - 10)</option>
              <option value="OUT_OF_STOCK">Out of Stock (0)</option>
            </select>
          </div>

        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-white border-b-2 border-slate-100">
                <th className="p-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Barcode / ID</th>
                <th className="p-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Item Details</th>
                <th className="p-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="p-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Stock Qty</th>
                <th className="p-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Unit Cost</th>
                <th className="p-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Selling Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredVariants.length > 0 ? (
                filteredVariants.map((v) => (
                  <tr key={v.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                    
                    {/* Barcode */}
                    <td className="p-5 align-middle">
                      <div className="flex items-center gap-2 group/barcode">
                        <BarcodeIcon size={16} className="text-slate-300" />
                        <span className="font-mono font-bold text-slate-600 text-sm tracking-wide">{v.barcode}</span>
                        <button 
                          onClick={() => handlePrintBarcode(v)}
                          title="Print Barcode"
                          className="opacity-0 group-hover/barcode:opacity-100 transition-opacity p-1 bg-slate-100 hover:bg-[#1D4ED8] hover:text-white rounded-md text-slate-400"
                        >
                          <Printer size={14} />
                        </button>
                      </div>
                    </td>

                    {/* Item Details */}
                    <td className="p-5 align-middle">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-slate-900 text-[15px]">{v.parentProductName}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {v.brand && <span className="text-[10px] font-bold bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded shadow-sm">{v.brand}</span>}
                          {v.color && <span className="text-[10px] font-bold bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded shadow-sm">{v.color}</span>}
                          {v.size && <span className="text-[10px] font-bold bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded shadow-sm">{v.size}</span>}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-5 align-middle">
                      <span className="text-xs font-bold text-[#1D4ED8] bg-[#EFF6FF] px-2.5 py-1 rounded-md uppercase tracking-wide">
                        {v.parentCategory}
                      </span>
                    </td>

                    {/* Stock Quantity */}
                    <td className="p-5 align-middle text-center">
                      <div className={`inline-flex items-center justify-center min-w-[3rem] px-3 py-1 rounded-full font-black text-sm border ${
                        v.quantity <= 0 
                          ? 'bg-red-50 text-red-600 border-red-200' 
                          : v.quantity <= 10 
                            ? 'bg-orange-50 text-orange-600 border-orange-200'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      }`}>
                        {v.quantity}
                      </div>
                    </td>

                    {/* Purchase Price */}
                    <td className="p-5 align-middle text-right font-semibold text-slate-500 text-sm">
                      {formatLKR(v.purchasePrice)}
                    </td>

                    {/* Selling Price */}
                    <td className="p-5 align-middle text-right">
                      <span className="font-black text-slate-900 text-[15px]">
                        {formatLKR(v.sellingPrice)}
                      </span>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400 font-medium bg-slate-50">
                    <Package size={48} className="mx-auto mb-4 opacity-20 text-[#1D4ED8]" />
                    No inventory records match your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
