import React from 'react';
import { Search, Package, ArrowLeftRight, Download } from 'lucide-react';

const InventoryPage = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-500">Track stock levels and receive goods.</p>
      </header>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button className="flex items-center gap-2 px-4 py-2 border-b-2 border-black font-medium text-sm">
          <Package size={18} />
          Current Stock
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-black font-medium text-sm transition-colors">
          <Download size={18} />
          Goods Receiving
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-black font-medium text-sm transition-colors">
          <ArrowLeftRight size={18} />
          Adjustments
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Search Bar Area */}
        <div className="p-4 border-b border-gray-50">
          <div className="relative max-w-full">
            <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search inventory..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <div>Product</div>
          <div>Size/Color</div>
          <div className="text-center">Current Stock</div>
          <div className="text-center">Min Stock</div>
          <div className="text-right">Status</div>
        </div>

        {/* Table Body (Empty State/Placeholder) */}
        <div className="p-12 text-center text-gray-400 italic">
          No inventory items found. Start by adding products or receiving goods.
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;