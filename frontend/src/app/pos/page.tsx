"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingCart, 
  Banknote, 
  CreditCard, 
  Barcode, 
  X, 
  Monitor, 
  Wifi, 
  CreditCard as CardIcon,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Search,
  Loader2,
  Clock
} from 'lucide-react';
import { productApi, posApi, getStoredUser, AuthResponse, ProductVariantDTO, ProductDTO } from '@/lib/api';
import { useBarcodeScanner } from '@/hooks/useBarcodeScanner';

// --- Types ---
interface CartItem {
  variantId: number;
  barcode: string;
  productName: string;
  brand?: string;
  size?: string;
  color?: string;
  sellingPrice: number;
  quantity: number;
}

const POSInterface = () => {
  // --- State ---
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<ProductDTO[]>([]);
  const [searchResults, setSearchResults] = useState<{product: ProductDTO, variant: ProductVariantDTO}[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [discount, setDiscount] = useState<number>(0);
  
  const [activeModal, setActiveModal] = useState<'none' | 'cash' | 'card'>('none');
  const [cardMethod, setCardMethod] = useState<'tap' | 'manual'>('tap');
  const [receivedAmount, setReceivedAmount] = useState<string>('');
  const [saleSuccess, setSaleSuccess] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<AuthResponse | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => {
    setCurrentUser(getStoredUser());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Fetch all products for autocomplete
    productApi.getAll().then(setAllProducts).catch(console.error);

    return () => clearInterval(timer);
  }, []);

  // Ensure barcode input stays focused when modal is closed
  useEffect(() => {
    if (activeModal === 'none' && !saleSuccess) {
      barcodeInputRef.current?.focus();
    }
  }, [activeModal, saleSuccess]);

  // --- Derived State ---
  const subtotal = cartItems.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);
  const totalAmount = Math.max(0, subtotal - discount);
  const changeDue = Math.max(0, Number(receivedAmount) - totalAmount);

  // --- Formatters ---
  const formatLKR = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
    }).format(amount).replace('LKR', 'Rs.');
  };

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBarcodeInput(val);
    
    if (val.trim().length > 0) {
      const q = val.toLowerCase();
      const results: {product: ProductDTO, variant: ProductVariantDTO}[] = [];
      
      for (const p of allProducts) {
        if (!p.variants) continue;
        for (const v of p.variants) {
          if (
            v.barcode?.toLowerCase().includes(q) ||
            p.productName?.toLowerCase().includes(q) ||
            v.brand?.toLowerCase().includes(q)
          ) {
            results.push({ product: p, variant: v });
          }
        }
      }
      setSearchResults(results.slice(0, 10)); // Limit to top 10
      setShowDropdown(true);
      setSelectedIndex(-1);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
      setSelectedIndex(-1);
    }
  };

  const addToCart = React.useCallback((product: ProductDTO, variant: ProductVariantDTO) => {
      setCartItems(prev => {
        const existingItemIndex = prev.findIndex(item => item.variantId === variant.id);
        
        if (existingItemIndex >= 0) {
          const newItems = [...prev];
          newItems[existingItemIndex].quantity += 1;
          return newItems;
        } else {
          return [{
            variantId: variant.id,
            barcode: variant.barcode,
            productName: product.productName,
            brand: variant.brand,
            size: variant.size,
            color: variant.color,
            sellingPrice: variant.sellingPrice,
            quantity: 1
          }, ...prev];
        }
      });
      setBarcodeInput('');
      setShowDropdown(false);
      barcodeInputRef.current?.focus();
  }, []);

  const handleScannerInput = React.useCallback(async (scannedBarcode: string) => {
    if (!scannedBarcode.trim()) return;

    // Check if there is an exact match in allProducts
    let exactMatch = null;
    for (const p of allProducts) {
      if (p.variants) {
        const v = p.variants.find(v => v.barcode === scannedBarcode.trim());
        if (v) {
          exactMatch = { product: p, variant: v };
          break;
        }
      }
    }

    if (exactMatch) {
      addToCart(exactMatch.product, exactMatch.variant);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const variant = await productApi.getVariantByBarcode(scannedBarcode.trim());
      addToCart({ id: 0, productName: `Product #${variant.id}`, category: 'Unknown', variants: [] }, variant);
    } catch (err: any) {
      setSearchError('Product not found');
      setTimeout(() => setSearchError(null), 3000);
    } finally {
      setIsSearching(false);
      barcodeInputRef.current?.focus();
    }
  }, [allProducts, addToCart]);

  useBarcodeScanner({ onScan: handleScannerInput });

  const handleBarcodeSubmit = async (e: React.FormEvent | React.KeyboardEvent) => {
    if ('key' in e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : prev));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (showDropdown && searchResults.length > 0 && selectedIndex >= 0) {
          const selected = searchResults[selectedIndex];
          addToCart(selected.product, selected.variant);
        } else {
          await handleScannerInput(barcodeInput);
        }
        return;
      }
    }
  };

  const updateQuantity = (variantId: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.variantId === variantId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (variantId: number) => {
    setCartItems(prev => prev.filter(item => item.variantId !== variantId));
  };

  const handleClearOrder = () => {
    setCartItems([]);
    setDiscount(0);
    setBarcodeInput('');
    barcodeInputRef.current?.focus();
  };

  const handleCompleteSale = async (method: 'CASH' | 'CARD') => {
    try {
      const payload = {
        discount: discount || 0,
        paymentMethod: method,
        items: cartItems.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.sellingPrice
        }))
      };
      
      await posApi.createSale(payload);
      setActiveModal('none');
      setSaleSuccess(true);
    } catch (err: any) {
      alert("Sale failed: " + err.message);
    }
  };

  const handleNewSale = () => {
    setSaleSuccess(false);
    handleClearOrder();
  };

  const handlePrintReceipt = () => {
    const printerSize = localStorage.getItem('sw_printer') || '80mm';
    let width = '100%';
    let pageSizeCss = 'auto';

    if (printerSize === '58mm') {
      width = '58mm';
      pageSizeCss = '58mm auto';
    } else if (printerSize === '80mm') {
      width = '80mm';
      pageSizeCss = '80mm auto';
    } else if (printerSize === '53mm') {
      width = '53mm';
      pageSizeCss = '53mm auto';
    } else if (printerSize === 'A4') {
      width = '210mm';
      pageSizeCss = 'A4';
    } else if (printerSize === 'A5') {
      width = '148mm';
      pageSizeCss = 'A5';
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const html = `
      <html>
        <head>
          <style>
            @page { margin: 0; size: ${pageSizeCss}; }
            body { font-family: monospace; width: ${width}; margin: 0 auto; padding: 10px; font-size: 12px; }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .row { display: flex; justify-content: space-between; margin-bottom: 4px; }
            .dashed { border-bottom: 1px dashed #000; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="center bold" style="font-size: 16px;">SmartWave ERP</div>
          <div class="center">POS Receipt</div>
          <div class="dashed"></div>
          <div>Date: ${new Date().toLocaleString('en-LK')}</div>
          <div>Cashier: ${currentUser?.fullName || 'Demo User'}</div>
          <div class="dashed"></div>
          ${cartItems.map(item => `
            <div>${item.productName}</div>
            <div class="row">
              <span>${item.quantity} x ${item.sellingPrice}</span>
              <span>${item.quantity * item.sellingPrice}</span>
            </div>
          `).join('')}
          <div class="dashed"></div>
          <div class="row bold">
            <span>Subtotal:</span>
            <span>${subtotal}</span>
          </div>
          ${discount > 0 ? `<div class="row"><span>Discount:</span><span>-${discount}</span></div>` : ''}
          <div class="row bold" style="font-size: 14px;">
            <span>Total Paid:</span>
            <span>${totalAmount}</span>
          </div>
          <div class="row">
            <span>Payment Method:</span>
            <span>${activeModal.toUpperCase()}</span>
          </div>
          <div class="dashed"></div>
          <div class="center">Thank you for your purchase!</div>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

  // --- Render ---
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8fafc] p-6 font-sans text-slate-800 flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-2">
        <div>
          <h1 className="text-xl font-bold text-[#1D4ED8]">Point of Sale</h1>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
            Terminal 01 • Cashier: {currentUser?.fullName || 'Demo User'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-slate-500 font-medium bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
          <Clock size={16} className="text-[#1D4ED8]" />
          {currentTime ? currentTime.toLocaleTimeString() : '--:--:--'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-start">
        
        {/* LEFT PANEL: Cart & Search */}
        <div className="lg:col-span-2 space-y-4 flex flex-col h-full">
          
          {/* Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative z-10">
            <div className="absolute inset-y-0 left-6 flex items-center text-slate-400">
              {isSearching ? <Loader2 size={20} className="animate-spin text-[#1D4ED8]" /> : <Search size={20} />}
            </div>
            <input 
              ref={barcodeInputRef}
              type="text" 
              value={barcodeInput}
              onChange={handleInputChange}
              onKeyDown={handleBarcodeSubmit}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              onFocus={() => { if(searchResults.length > 0) setShowDropdown(true); }}
              placeholder="Search by name, brand, or scan barcode..." 
              className={`w-full pl-12 pr-4 py-2.5 bg-slate-50 border ${searchError ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'} rounded-xl outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-[#1D4ED8] text-sm transition-all`}
              autoFocus
            />
            {searchError && (
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-bold text-red-500 bg-red-50 px-2 py-1 rounded">
                {searchError}
              </span>
            )}
            
            {/* Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-80 overflow-y-auto">
                {searchResults.map((res, idx) => (
                  <div 
                    key={`${res.product.id}-${res.variant.id}-${idx}`}
                    onMouseDown={() => addToCart(res.product, res.variant)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`p-3 border-b border-slate-50 cursor-pointer flex justify-between items-center transition-colors ${selectedIndex === idx ? 'bg-[#EFF6FF] border-[#BFDBFE]' : 'hover:bg-slate-50'}`}
                  >
                    <div>
                      <div className="font-semibold text-sm text-slate-800">{res.product.productName}</div>
                      <div className="text-[11px] text-slate-500 flex gap-2 mt-0.5">
                        <span className="bg-slate-100 px-1.5 rounded text-slate-700 font-semibold">{res.variant.barcode}</span>
                        {res.variant.brand && <span>• {res.variant.brand}</span>}
                        {res.variant.size && <span>• Size {res.variant.size}</span>}
                        {res.variant.color && <span>• {res.variant.color}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#1D4ED8] text-sm">{formatLKR(res.variant.sellingPrice)}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">{res.variant.quantity} in stock</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden min-h-[400px]">
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 grid grid-cols-12 gap-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div className="col-span-5">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Price</div>
              <div className="col-span-1 text-center"></div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 min-h-[300px]">
                  <ShoppingCart size={64} strokeWidth={1} className="mb-4 opacity-20 text-[#1D4ED8]" />
                  <p className="font-medium text-slate-400">Cart is empty</p>
                  <p className="text-sm mt-2">Scan a barcode to add items</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.variantId} className="grid grid-cols-12 gap-4 items-center px-4 py-3 bg-white hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-100 transition-colors group">
                      
                      <div className="col-span-5 flex flex-col">
                        <span className="font-semibold text-sm text-slate-800">{item.productName}</span>
                        <div className="flex gap-2 mt-1">
                          {item.brand && <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{item.brand}</span>}
                          {item.size && <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{item.size}</span>}
                          {item.color && <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{item.color}</span>}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 uppercase">ID: {item.barcode}</span>
                      </div>

                      <div className="col-span-3 flex items-center justify-center gap-3">
                        <button onClick={() => updateQuantity(item.variantId, -1)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-[#1D4ED8] transition-colors"><Minus size={14}/></button>
                        <span className="w-8 text-center font-bold text-lg">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.variantId, 1)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-[#1D4ED8] transition-colors"><Plus size={14}/></button>
                      </div>

                      <div className="col-span-3 text-right flex flex-col">
                        <span className="font-bold text-slate-800 text-sm">{formatLKR(item.sellingPrice * item.quantity)}</span>
                        {item.quantity > 1 && <span className="text-[11px] text-slate-400">{formatLKR(item.sellingPrice)} each</span>}
                      </div>

                      <div className="col-span-1 flex justify-center">
                        <button onClick={() => removeItem(item.variantId)} className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={16} />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-[#1D4ED8] mb-6 flex items-center gap-2">
              <Banknote size={20} />
              Order Summary
            </h2>
            
            <div className="space-y-5">
              <div className="flex justify-between text-slate-600 font-semibold text-sm">
                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                <span>{formatLKR(subtotal)}</span>
              </div>
              
              <div className="flex justify-between items-center text-slate-600 font-semibold text-sm">
                <span>Discount</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Rs.</span>
                  <input 
                    type="number" 
                    value={discount || ''} 
                    onChange={(e) => setDiscount(Number(e.target.value))} 
                    className="w-20 px-2 py-1 border border-slate-300 rounded text-right font-bold text-slate-900 outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8] transition-all" 
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="border-t border-dashed border-slate-200 pt-4"></div>
              
              <div className="flex justify-between items-end mb-8">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-1">Total Due</span>
                <span className="text-2xl font-bold text-[#1D4ED8]">{formatLKR(totalAmount)}</span>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => setActiveModal('cash')} 
                  disabled={cartItems.length === 0}
                  className="w-full bg-[#1D4ED8] text-white hover:bg-[#1e40af] py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <Banknote size={16} /> Pay with Cash
                </button>
                <button 
                  onClick={() => setActiveModal('card')} 
                  disabled={cartItems.length === 0}
                  className="w-full bg-[#1D4ED8] text-white hover:bg-[#1e40af] py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <CreditCard size={16} /> Pay with Card
                </button>
              </div>

              <div className="pt-6">
                <button 
                  onClick={handleClearOrder}
                  disabled={cartItems.length === 0}
                  className="w-full bg-[#1D4ED8] text-white hover:bg-[#1e40af] py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <Trash2 size={16} /> Clear Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- PAYMENT MODAL --- */}
      {activeModal !== 'none' && !saleSuccess && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-extrabold text-[#1D4ED8] flex items-center gap-2">
                {activeModal === 'cash' ? <Banknote/> : <CreditCard/>} 
                {activeModal === 'cash' ? 'Cash Payment' : 'Card Payment'}
              </h3>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-2 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <div className="p-8">
              <div className="text-center mb-8 bg-[#EFF6FF] py-6 rounded-2xl border border-[#BFDBFE]">
                <p className="text-[#2563EB] text-xs font-bold uppercase tracking-widest mb-1">Amount Due</p>
                <h4 className="text-4xl font-black text-[#1D4ED8]">{formatLKR(totalAmount)}</h4>
              </div>

              {activeModal === 'cash' ? (
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Received Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">Rs.</span>
                      <input 
                        autoFocus 
                        type="number" 
                        value={receivedAmount} 
                        onChange={(e) => setReceivedAmount(e.target.value)} 
                        className="w-full pl-14 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-2xl font-bold text-slate-900 focus:border-[#1D4ED8] focus:ring-4 focus:ring-[#BFDBFE] outline-none transition-all" 
                        placeholder="0.00" 
                      />
                    </div>
                  </div>
                  
                  <div className={`p-5 rounded-2xl border flex justify-between items-center transition-colors ${Number(receivedAmount) >= totalAmount ? 'bg-[#ECFDF5] border-[#A7F3D0]' : 'bg-slate-50 border-slate-100'}`}>
                    <span className="font-bold text-slate-600">Change Due:</span>
                    <span className={`text-2xl font-black ${Number(receivedAmount) >= totalAmount ? 'text-[#059669]' : 'text-slate-400'}`}>
                      {formatLKR(changeDue)}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => handleCompleteSale('CASH')}
                    disabled={Number(receivedAmount) < totalAmount}
                    className="w-full bg-[#1D4ED8] text-white hover:bg-[#1e40af] py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    Complete Sale
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
                    <button onClick={() => setCardMethod('tap')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${cardMethod === 'tap' ? 'bg-white text-[#1D4ED8] shadow-sm' : 'text-slate-500'}`}>
                      <Wifi size={18} className="rotate-90" /> Tap / Swipe
                    </button>
                    <button onClick={() => setCardMethod('manual')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${cardMethod === 'manual' ? 'bg-white text-[#1D4ED8] shadow-sm' : 'text-slate-500'}`}>
                      <Monitor size={18} /> Manual Entry
                    </button>
                  </div>

                  {cardMethod === 'tap' ? (
                    <div className="text-center py-10">
                      <div className="w-20 h-20 bg-[#EFF6FF] text-[#1D4ED8] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Wifi size={40} className="rotate-90" />
                      </div>
                      <p className="text-slate-500 font-bold">Waiting for card action...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Card Number</label>
                        <div className="relative">
                          <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold outline-none focus:border-[#1D4ED8] transition-colors" />
                          <CardIcon className="absolute right-4 top-4 text-slate-300" size={20} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="MM/YY" className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold outline-none focus:border-[#1D4ED8] transition-colors" />
                        <input type="text" placeholder="CVV" className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold outline-none focus:border-[#1D4ED8] transition-colors" />
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => handleCompleteSale('CARD')}
                    className="w-full bg-[#1D4ED8] text-white hover:bg-[#1e40af] py-2 rounded-lg font-medium text-sm transition-all shadow-sm"
                  >
                    {cardMethod === 'tap' ? 'Simulate Success' : 'Charge Card'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- SUCCESS OVERLAY --- */}
      {saleSuccess && (
        <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center animate-in fade-in duration-300">
          <div className="max-w-md w-full text-center p-8">
            <div className="w-24 h-24 bg-[#ECFDF5] text-[#059669] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">Sale Complete!</h2>
            <p className="text-slate-500 font-medium mb-8">Payment processed successfully.</p>
            
            <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 text-left space-y-3">
              <div className="flex justify-between text-sm font-semibold text-slate-600">
                <span>Items:</span>
                <span>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-slate-600">
                <span>Subtotal:</span>
                <span>{formatLKR(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm font-semibold text-[#059669]">
                  <span>Discount:</span>
                  <span>-{formatLKR(discount)}</span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-3 flex justify-between font-black text-lg text-slate-800">
                <span>Total Paid:</span>
                <span>{formatLKR(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest pt-2">
                <span>Method:</span>
                <span>{activeModal}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                className="w-full bg-[#1D4ED8] text-white hover:bg-[#1e40af] py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
                onClick={handlePrintReceipt}
              >
                Print Receipt
              </button>
              <button 
                onClick={handleNewSale}
                className="w-full bg-[#1D4ED8] text-white hover:bg-[#1e40af] py-2 rounded-lg font-medium text-sm transition-all shadow-sm"
              >
                New Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSInterface;