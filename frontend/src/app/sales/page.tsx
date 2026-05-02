"use client";

import React, { useState, useEffect } from "react";
import { posApi, SaleDto } from "@/lib/api";
import { Receipt, Search, Calendar, CreditCard, Banknote, Loader2 } from "lucide-react";
import { pageStyle, titleStyle } from "@/styles/sharedStyles";

export default function SalesPage() {
  const [sales, setSales] = useState<SaleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const data = await posApi.getAllSales();
      setSales(data.sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()));
    } catch (error) {
      console.error("Failed to load sales", error);
    } finally {
      setLoading(false);
    }
  };

  const formatLKR = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
    }).format(amount).replace('LKR', 'Rs.');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-LK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredSales = sales.filter(s => 
    s.cashierName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toString().includes(searchQuery)
  );

  return (
    <div style={pageStyle}>
      <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-6">
        <div>
          <h1 style={titleStyle}>Sales Ledger</h1>
          <h2 className="text-slate-500 font-medium">View all POS transactions and receipts.</h2>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] px-6 py-3 rounded-xl flex items-center gap-3 shadow-sm">
            <Receipt className="text-[#1D4ED8]" size={20} />
            <div>
              <p className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider">Total Revenue</p>
              <p className="text-xl font-black text-[#1E3A8A]">
                {formatLKR(sales.reduce((sum, s) => sum + s.totalAmount, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Cashier or Receipt ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-[#1D4ED8] text-sm transition-all shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="animate-spin text-[#1D4ED8]" size={32} />
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="p-16 text-center text-slate-500">
            <Receipt size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-bold">No sales found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="p-4 pl-6">Receipt ID</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Cashier</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4 text-right pr-6">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="p-4 pl-6 font-bold text-slate-800">
                      #{sale.id.toString().padStart(6, '0')}
                    </td>
                    <td className="p-4 text-sm text-slate-600 flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      {formatDate(sale.saleDate)}
                    </td>
                    <td className="p-4 text-sm font-semibold text-slate-700">
                      {sale.cashierName}
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                        {sale.items.reduce((sum, i) => sum + i.quantity, 0)} items
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                        {sale.paymentMethod === 'CARD' ? (
                          <><CreditCard size={16} className="text-purple-500" /> Card</>
                        ) : (
                          <><Banknote size={16} className="text-emerald-500" /> Cash</>
                        )}
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-right font-black text-[#1D4ED8]">
                      {formatLKR(sale.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
