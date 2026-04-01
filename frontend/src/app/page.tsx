import React from 'react';
import { TrendingUp, Box, AlertTriangle, ShoppingCart, ArrowUpRight } from 'lucide-react';

// Reusable Card Component for the Stats
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  colorClass, 
  iconBg 
}: { 
  title: string; 
  value: string | number; 
  icon: any; 
  colorClass: string; 
  iconBg: string;
}) => (
  <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between min-h-[160px]">
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-2xl ${iconBg}`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
      <span className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mt-1">
        {title}
      </span>
    </div>
    
    <div className="flex justify-between items-end mt-4">
      <span className="text-4xl font-bold text-gray-900">{value}</span>
      <div className="flex items-center text-emerald-500 font-medium text-sm mb-1">
        <ArrowUpRight className="w-4 h-4 mr-0.5" />
        12%
      </div>
    </div>
  </div>
);

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] p-8 lg:p-12">
      {/* Welcome Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Welcome back, System Administrator
        </h1>
        <p className="text-gray-500 text-lg mt-2 font-medium">
          Here's what's happening with <span className="text-gray-800">SmartWave</span> today.
        </p>
      </header>

      {/* 4-Column Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Today's Sales" 
          value="$0" 
          icon={TrendingUp} 
          colorClass="text-emerald-500" 
          iconBg="bg-emerald-50" 
        />
        <StatCard 
          title="Total Products" 
          value="0" 
          icon={Box} 
          colorClass="text-blue-500" 
          iconBg="bg-blue-50" 
        />
        <StatCard 
          title="Low Stock Items" 
          value="0" 
          icon={AlertTriangle} 
          colorClass="text-orange-500" 
          iconBg="bg-orange-50" 
        />
        <StatCard 
          title="Total Inventory" 
          value="0" 
          icon={ShoppingCart} 
          colorClass="text-purple-500" 
          iconBg="bg-purple-50" 
        />
      </div>

      {/* Bottom Layout - Charts placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Chart Card */}
        <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm min-h-[420px]">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Sales Performance</h2>
          <div className="border-t border-dashed border-gray-200 w-full" />
          <div className="h-full flex items-center justify-center text-gray-300 font-medium">
             Chart area
          </div>
        </div>
        
        {/* Inventory Chart Card */}
        <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm min-h-[420px]">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Inventory Distribution</h2>
          <div className="border-t border-dashed border-gray-200 w-full" />
          <div className="h-full flex items-center justify-center text-gray-300 font-medium">
             Chart area
          </div>
        </div>
      </div>
    </main>
  );
}