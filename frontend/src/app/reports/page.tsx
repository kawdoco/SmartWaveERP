"use client";

import React from 'react';
import { 
  Download, 
  DollarSign, 
  Package, 
  TrendingUp 
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bgClass} ${colorClass}`}>
      <Icon size={24} />
    </div>
    <div className="flex flex-col">
      <span className="text-gray-500 text-sm font-medium mb-1">{title}</span>
      <span className="text-3xl font-bold text-gray-900">{value}</span>
    </div>
  </div>
);

export default function ReportsPage() {
  return (
    <main className="min-h-screen p-8 lg:p-12 font-sans">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Financial Reports</h1>
            <p className="text-gray-500 text-[15px]">Comprehensive overview of sales and inventory performance.</p>
          </div>
          <button className="flex items-center gap-2 bg-[#18181B] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">
            <Download size={18} />
            Export PDF
          </button>
        </div>

        {/* 3-Column Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total Sales (30d)" 
            value="$0" 
            icon={DollarSign} 
            colorClass="text-emerald-500" 
            bgClass="bg-emerald-50" 
          />
          <StatCard 
            title="Inventory Cost Value" 
            value="$0" 
            icon={Package} 
            colorClass="text-blue-500" 
            bgClass="bg-blue-50" 
          />
          <StatCard 
            title="Potential Revenue" 
            value="$0" 
            icon={TrendingUp} 
            colorClass="text-purple-500" 
            bgClass="bg-purple-50" 
          />
        </div>

        {/* 2-Column Analytics Placeholders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm min-h-[400px] flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 mb-8">Sales Trend (Last 30 Days)</h2>
            <div className="flex-1 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center">
              {/* Chart Placeholder Area matching the screenshot's empty area footprint */}
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm min-h-[400px] flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 mb-8">Top 5 Selling Products</h2>
            <div className="flex-1 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center">
               {/* List Placeholder Area */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
