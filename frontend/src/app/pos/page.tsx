"use client";

import React, { useState } from 'react';
// Replaced Contactless with Wifi and Laptop with Monitor for better compatibility
import { 
  ShoppingCart, 
  Banknote, 
  CreditCard, 
  Barcode, 
  X, 
  Monitor, 
  Wifi, 
  CreditCard as CardIcon 
} from 'lucide-react';

const POSInterface = () => {
  const [subtotal] = useState(1550.00);
  const [discount, setDiscount] = useState(0);
  const [activeModal, setActiveModal] = useState<'none' | 'cash' | 'card'>('none');
  const [cardMethod, setCardMethod] = useState<'tap' | 'manual'>('tap');
  const [receivedAmount, setReceivedAmount] = useState<string>('');

  const totalAmount = subtotal - discount;

  const formatLKR = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
    }).format(amount).replace('LKR', 'Rs.');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Section */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center text-slate-400"><Barcode size={20} /></div>
              <input type="text" placeholder="Scan barcode..." className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 text-lg" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 min-h-[400px] flex flex-col items-center justify-center text-slate-300">
            <ShoppingCart size={64} strokeWidth={1} className="mb-4 opacity-20" />
            <p className="font-medium text-slate-400">Cart is empty</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="md:col-span-1">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm sticky top-8">
            <h2 className="text-2xl font-bold mb-8">Order Summary</h2>
            <div className="space-y-6">
              <div className="flex justify-between text-slate-500 text-lg"><span>Subtotal</span><span>{formatLKR(subtotal)}</span></div>
              <div className="flex justify-between items-center text-slate-500 text-lg">
                <span>Discount</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold opacity-50">Rs.</span>
                  <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="w-24 px-3 py-1 border-2 border-slate-800 rounded-md text-right font-bold text-slate-900 outline-none" />
                </div>
              </div>
              <div className="border-t border-dashed border-slate-200 pt-6"></div>
              <div className="flex justify-between items-end mb-10">
                <span className="text-lg font-semibold text-gray-500 pb-1">Total Amount</span>
                <span className="text-4xl font-black text-slate-900">{formatLKR(totalAmount)}</span>
              </div>
              <button onClick={() => setActiveModal('cash')} className="w-full bg-[#82D1B1] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 active:scale-95 transition-all shadow-md"><Banknote /> Pay with Cash</button>
              <button onClick={() => setActiveModal('card')} className="w-full bg-[#8E8E8E] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 active:scale-95 transition-all shadow-md"><CreditCard /> Pay with Card</button>
            </div>
          </div>
        </div>
      </div>

      {/* --- PAYMENT MODAL --- */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden">
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">{activeModal === 'cash' ? 'Cash Payment' : 'Card Payment'}</h3>
              <button onClick={() => setActiveModal('none')} className="hover:bg-slate-100 p-2 rounded-full"><X size={20} /></button>
            </div>

            <div className="p-8">
              <div className="text-center mb-8 bg-slate-50 py-6 rounded-2xl border border-slate-100">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Amount Due</p>
                <h4 className="text-4xl font-black text-slate-900">{formatLKR(totalAmount)}</h4>
              </div>

              {activeModal === 'cash' ? (
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">Received Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">Rs.</span>
                      <input autoFocus type="number" value={receivedAmount} onChange={(e) => setReceivedAmount(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-2xl font-bold text-slate-900 focus:border-[#82D1B1] outline-none transition-all" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="p-5 bg-[#82D1B1]/10 rounded-2xl border border-[#82D1B1]/20 flex justify-between items-center">
                    <span className="font-bold text-slate-600">Change Due:</span>
                    <span className="text-2xl font-black text-[#69b394]">{formatLKR(Math.max(0, Number(receivedAmount) - totalAmount))}</span>
                  </div>
                  <button className="w-full bg-[#82D1B1] text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:brightness-105 transition-all">Complete Sale</button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
                    <button onClick={() => setCardMethod('tap')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${cardMethod === 'tap' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
                      <Wifi size={18} className="rotate-90" /> Tap / Swipe
                    </button>
                    <button onClick={() => setCardMethod('manual')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${cardMethod === 'manual' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
                      <Monitor size={18} /> Manual Entry
                    </button>
                  </div>

                  {cardMethod === 'tap' ? (
                    <div className="text-center py-10">
                      <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Wifi size={40} className="rotate-90" />
                      </div>
                      <p className="text-slate-500 font-bold">Waiting for card action...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Card Number</label>
                        <div className="relative">
                          <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold outline-none" />
                          <CardIcon className="absolute right-4 top-4 text-slate-300" size={20} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="MM/YY" className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold outline-none" />
                        <input type="text" placeholder="CVV" className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold outline-none" />
                      </div>
                    </div>
                  )}

                  <button className="w-full bg-slate-800 text-white py-5 rounded-2xl font-black text-xl hover:bg-slate-900 active:scale-95 transition-all">
                    {cardMethod === 'tap' ? 'Processing...' : 'Charge Card'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSInterface;