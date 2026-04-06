"use client"; // <--- This must be the very first line

import React, { useState } from 'react';
import { Search, ShoppingCart, Banknote, CreditCard, Barcode } from 'lucide-react';

const POSInterface = () => {
  const [subtotal, setSubtotal] = useState(0.00);
  const [discount, setDiscount] = useState(0);

  // Currency Formatter for LKR
  const formatLKR = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
    }).format(amount).replace('LKR', 'Rs.');
  };

  const totalAmount = subtotal - discount;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Search and Cart */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Search Bar Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                <Barcode size={20} />
              </div>
              <input
                type="text"
                placeholder="Scan barcode or search products..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all text-lg"
              />
            </div>
          </div>

          {/* Current Cart Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-bold text-lg uppercase tracking-tight text-slate-700">Current Cart</h2>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">0 Items</span>
            </div>
            
            <div className="flex-grow flex flex-col items-center justify-center text-gray-300">
              <ShoppingCart size={64} strokeWidth={1} className="mb-4 opacity-20" />
              <p className="font-medium text-gray-400">Cart is empty</p>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm sticky top-8">
            <h2 className="text-2xl font-bold mb-8 text-slate-900">Order Summary</h2>
            
            <div className="space-y-6">
              {/* Subtotal */}
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-lg">Subtotal</span>
                <span className="font-medium">{formatLKR(subtotal)}</span>
              </div>

              {/* Discount Input */}
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-lg">Discount</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-400">Rs.</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-24 px-3 py-1 border-2 border-slate-800 rounded-md text-right font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-6 my-2"></div>

              {/* Total */}
              <div className="flex justify-between items-end mb-10">
                <span className="text-lg font-semibold text-gray-500 pb-1">Total Amount</span>
                <span className="text-4xl font-black tracking-tighter text-slate-900">
                  {formatLKR(totalAmount)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-[#82D1B1] hover:bg-[#71c4a2] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-colors shadow-sm active:scale-[0.98]">
                  <Banknote size={24} />
                  Pay with Cash
                </button>
                
                <button className="w-full bg-[#8E8E8E] hover:bg-[#7a7a7a] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-colors shadow-sm active:scale-[0.98]">
                  <CreditCard size={24} />
                  Pay with Card
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default POSInterface;