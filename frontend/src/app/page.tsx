"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  getStoredToken, 
  productApi, 
  procurementApi, 
  supplierApi,
  getStoredUser,
  clearAuthData
} from '@/lib/api';
import { 
  TrendingUp, 
  Box, 
  AlertTriangle, 
  ShoppingCart, 
  ArrowUpRight,
  LayoutDashboard,
  Users,
  Package,
  ArrowRight,
  Loader2
} from 'lucide-react';

// --- Sub-Components from Dev Branch ---

// --- StatCard Component ---
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
    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between min-h-[160px] hover:border-blue-200 hover:shadow-md transition-all">
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
      <div className="flex items-center text-blue-600 font-medium text-sm mb-1">
        <ArrowUpRight className="w-4 h-4 mr-0.5" />
        Live
      </div>
    </div>
  </div>
);

// --- Local Action Card ---
const ActionCard = ({ title, desc, link, icon }: any) => (
  <Link href={link} className="no-underline block group">
    <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm transition-all hover:border-blue-300 hover:shadow-md h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition-colors">{icon}</div>
        <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  </Link>
);

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    inventoryValue: 0,
    pendingProcurement: 0,
    lowStock: 0
  });

  // --- Auth Guard Logic (from dev_copy) ---
  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.replace('/login');
    } else {
      setIsAuthenticated(true);
      setUser(getStoredUser());
      fetchDashboardData();
    }
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [products, procurement] = await Promise.all([
        productApi.getAll(),
        procurementApi.getAll()
      ]);

      const worth = products.reduce((acc, p) => 
        acc + (p.variants?.reduce((vAcc, v) => vAcc + (v.quantity * (v.sellingPrice || 0)), 0) || 0), 0
      );

      const lowStock = products.reduce((acc, p) => 
        acc + (p.variants?.filter(v => v.quantity < 10).length || 0), 0
      );

      setStats({
        totalProducts: products.length,
        inventoryValue: worth,
        pendingProcurement: procurement.filter(po => po.status === 'PENDING').length,
        lowStock: lowStock
      });
    } catch (err: any) {
      console.error("Dashboard Sync Failed:", err);
      // If the token is expired/invalid, the backend returns 403.
      // Clear stale auth data and redirect to login.
      if (err?.message?.includes('403')) {
        clearAuthData();
        router.replace('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  // --- Premium Dashboard UI (from local head) ---
  return (
    <main className="min-h-screen bg-[#F9FAFB] p-8 lg:p-12 font-sans">
      {/* Header Section */}
      <header className="mb-10 flex justify-between items-start">
        <div>
           <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="text-slate-900" size={28} />
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Operational Overview
            </h1>
           </div>
           <p className="text-gray-500 text-lg mt-2 font-medium">
            Welcome back, <span className="text-gray-800 font-bold">{user?.fullName || 'System Admin'}</span>. Here's your SmartWave status.
           </p>
        </div>
        <div className="px-5 py-2 bg-blue-700 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg">
            {user?.role || 'Access Granted'}
        </div>
      </header>

      {/* 4-Column Stats Grid Integrated from Dev Branch */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          title="Inventory Worth" 
          value={loading ? "..." : `Rs.${(stats.inventoryValue / 1000).toFixed(1)}k`} 

          icon={TrendingUp} 
          colorClass="text-emerald-500" 
          iconBg="bg-emerald-50" 
        />
        <StatCard 
          title="Catalog Models" 
          value={loading ? "..." : stats.totalProducts} 

          icon={Box} 
          colorClass="text-blue-500" 
          iconBg="bg-blue-50" 
        />
        <StatCard 
          title="Low Stock Alert" 
          value={loading ? "..." : stats.lowStock} 

          icon={AlertTriangle} 
          colorClass="text-orange-500" 
          iconBg="bg-orange-50" 
        />
        <StatCard 
          title="Pending Orders" 
          value={loading ? "..." : stats.pendingProcurement} 

          icon={ShoppingCart} 
          colorClass="text-purple-500" 
          iconBg="bg-purple-50" 
        />
      </div>

      {/* Primary Workflows */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Package size={20} className="text-slate-400" />
            Core ERP Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ActionCard 
               title="Textile Catalog" 
               desc="Manage hierarchical models and stock varients with barcode tracking." 
               link="/products" 
               icon={<Box size={20} />} 
            />
            <ActionCard 
               title="Procurement Hub" 
               desc="Create purchase orders and manage relationships with verified vendors." 
               link="/purchasing" 
               icon={<ShoppingCart size={20} />} 
            />
            <ActionCard 
               title="Staff Matrix" 
               desc="Manage system users, roles and verified manufacturer contacts." 
               link="/user" 
               icon={<Users size={20} />} 
            />
        </div>
      </div>

      {/* Analytics Placeholders from Dev Branch */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm min-h-[300px] flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-6 underline decoration-emerald-200 underline-offset-8">Sales Performance Sync</h2>
          <div className="flex-1 flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4 italic font-serif text-2xl">i</div>
             <p className="text-slate-400 font-medium">Historical sales analytics will sync automatically <br/> once transaction modules are finalized.</p>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm min-h-[300px] flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-6 underline decoration-blue-200 underline-offset-8">Stock Distribution Sync</h2>
          <div className="flex-1 flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4 italic font-serif text-2xl">S</div>
             <p className="text-slate-400 font-medium">Real-time category-wise distribution chart <br/> is currently being mapped to your catalog.</p>

          </div>
        </div>
      </div>
    </main>
  );
}