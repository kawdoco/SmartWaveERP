"use client";

import React, { useState, useEffect } from "react";
import { posApi, SaleDto, getStoredUser } from "@/lib/api";
import { pageStyle, titleStyle } from "@/styles/sharedStyles";

const COLORS = {
  blue: '#1D4ED8', lightBlue: '#EFF6FF', borderBlue: '#BFDBFE',
  green: '#16A34A', lightGreen: '#F0FDF4', borderGreen: '#BBF7D0',
  purple: '#7C3AED', lightPurple: '#F5F3FF', borderPurple: '#DDD6FE',
  orange: '#D97706', lightOrange: '#FFFBEB', borderOrange: '#FDE68A',
  slate: '#64748B', bg: '#F8FAFC', white: '#FFFFFF',
  dark: '#0F172A', border: '#E2E8F0'
};

type DateRange = '7d' | '30d' | '90d' | 'all';

export default function ReportsPage() {
  const [sales, setSales] = useState<SaleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'payments'>('overview');
  const [user, setUser] = useState<ReturnType<typeof getStoredUser>>(null);

  useEffect(() => {
    setUser(getStoredUser());
    posApi.getAllSales().then(data => {
      setSales(data.sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filterByRange = (items: SaleDto[]) => {
    if (dateRange === 'all') return items;
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - days);
    return items.filter(s => new Date(s.saleDate) >= cutoff);
  };

  const filtered = filterByRange(sales);
  const totalRevenue = filtered.reduce((s, x) => s + x.totalAmount, 0);
  const totalDiscount = filtered.reduce((s, x) => s + (x.discount || 0), 0);
  const avgOrder = filtered.length ? totalRevenue / filtered.length : 0;
  const totalItems = filtered.reduce((s, x) => s + x.items.reduce((si, i) => si + i.quantity, 0), 0);
  const cashSales = filtered.filter(s => s.paymentMethod === 'CASH');
  const cardSales = filtered.filter(s => s.paymentMethod === 'CARD');

  const formatLKR = (amount: number) =>
    new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 2 })
      .format(amount).replace('LKR', 'Rs.');

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString('en-LK', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  // Group sales by day for the bar chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString('en-LK', { month: 'short', day: 'numeric' });
  });
  const salesByDay = last7Days.map(label => {
    const total = sales.filter(s => {
      const d = new Date(s.saleDate);
      return d.toLocaleDateString('en-LK', { month: 'short', day: 'numeric' }) === label;
    }).reduce((sum, s) => sum + s.totalAmount, 0);
    return { label, total };
  });
  const maxDayTotal = Math.max(...salesByDay.map(d => d.total), 1);

  const handlePrint = () => window.print();

  const StatCard = ({ label, value, icon, color, lightColor, borderColor }: {
    label: string; value: string; icon: string; color: string; lightColor: string; borderColor: string;
  }) => (
    <div style={{
      backgroundColor: lightColor, border: `1px solid ${borderColor}`,
      borderRadius: '16px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px'
    }}>
      <div style={{ fontSize: '28px' }}>{icon}</div>
      <div>
        <p style={{ fontSize: '11px', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>{label}</p>
        <p style={{ fontSize: '22px', fontWeight: 800, color: COLORS.dark, margin: '2px 0 0' }}>{value}</p>
      </div>
    </div>
  );

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', borderBottom: `1px solid ${COLORS.border}`, paddingBottom: '24px' }}>
        <div>
          <h1 style={titleStyle}>Reports & Analytics</h1>
          <p style={{ color: COLORS.slate, margin: 0, fontWeight: 500 }}>Business performance insights and financial summaries.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Date range selector */}
          <div style={{ display: 'flex', backgroundColor: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: '12px', overflow: 'hidden' }}>
            {(['7d', '30d', '90d', 'all'] as DateRange[]).map(r => (
              <button key={r} onClick={() => setDateRange(r)} style={{
                padding: '8px 16px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                backgroundColor: dateRange === r ? COLORS.blue : 'transparent',
                color: dateRange === r ? COLORS.white : COLORS.slate,
                transition: 'all 0.2s'
              }}>
                {r === 'all' ? 'All' : r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
          <button onClick={handlePrint} className="bg-[#1D4ED8] text-white hover:bg-[#1e40af] px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm">
            🖨️ Print Report
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <div style={{ width: '40px', height: '40px', border: `3px solid ${COLORS.lightBlue}`, borderTopColor: COLORS.blue, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <StatCard label="Total Revenue" value={formatLKR(totalRevenue)} icon="💰" color={COLORS.blue} lightColor={COLORS.lightBlue} borderColor={COLORS.borderBlue} />
            <StatCard label="Total Sales" value={`${filtered.length} Transactions`} icon="🧾" color={COLORS.green} lightColor={COLORS.lightGreen} borderColor={COLORS.borderGreen} />
            <StatCard label="Avg. Order Value" value={formatLKR(avgOrder)} icon="📊" color={COLORS.purple} lightColor={COLORS.lightPurple} borderColor={COLORS.borderPurple} />
            <StatCard label="Items Sold" value={`${totalItems} Units`} icon="📦" color={COLORS.orange} lightColor={COLORS.lightOrange} borderColor={COLORS.borderOrange} />
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', backgroundColor: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding: '4px', width: 'fit-content' }}>
            {(['overview', 'sales', 'payments'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '8px 20px', border: 'none', borderRadius: '10px', cursor: 'pointer',
                fontWeight: 600, fontSize: '14px', textTransform: 'capitalize',
                backgroundColor: activeTab === tab ? COLORS.blue : 'transparent',
                color: activeTab === tab ? COLORS.white : COLORS.slate,
                transition: 'all 0.2s'
              }}>{tab}</button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Bar Chart */}
              <div style={{ backgroundColor: COLORS.white, borderRadius: '16px', padding: '24px', border: `1px solid ${COLORS.border}` }}>
                <h3 style={{ margin: '0 0 20px', fontWeight: 700, color: COLORS.dark }}>Revenue – Last 7 Days</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '160px' }}>
                  {salesByDay.map(({ label, total }) => (
                    <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: COLORS.blue }}>{total > 0 ? `Rs.${(total/1000).toFixed(1)}k` : ''}</span>
                      <div style={{
                        width: '100%', backgroundColor: COLORS.blue, borderRadius: '6px 6px 0 0',
                        height: `${(total / maxDayTotal) * 120}px`, minHeight: total > 0 ? '4px' : '2px',
                        opacity: total > 0 ? 1 : 0.15, transition: 'height 0.5s ease'
                      }} />
                      <span style={{ fontSize: '10px', color: COLORS.slate, textAlign: 'center', whiteSpace: 'nowrap' }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Split */}
              <div style={{ backgroundColor: COLORS.white, borderRadius: '16px', padding: '24px', border: `1px solid ${COLORS.border}` }}>
                <h3 style={{ margin: '0 0 20px', fontWeight: 700, color: COLORS.dark }}>Payment Methods</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'Cash', count: cashSales.length, total: cashSales.reduce((s, x) => s + x.totalAmount, 0), color: COLORS.green, icon: '💵' },
                    { label: 'Card', count: cardSales.length, total: cardSales.reduce((s, x) => s + x.totalAmount, 0), color: COLORS.purple, icon: '💳' },
                  ].map(pm => {
                    const pct = filtered.length ? Math.round((pm.count / filtered.length) * 100) : 0;
                    return (
                      <div key={pm.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 600, color: COLORS.dark }}>{pm.icon} {pm.label}</span>
                          <span style={{ fontWeight: 700, color: pm.color }}>{pct}% · {pm.count} txns</span>
                        </div>
                        <div style={{ height: '10px', backgroundColor: '#F1F5F9', borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: pm.color, borderRadius: '99px', transition: 'width 0.6s ease' }} />
                        </div>
                        <div style={{ marginTop: '4px', fontSize: '13px', color: COLORS.slate }}>{formatLKR(pm.total)}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#FAFBFC', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: COLORS.slate, fontWeight: 600 }}>Total Discounts Given</span>
                    <span style={{ fontWeight: 800, color: COLORS.orange }}>{formatLKR(totalDiscount)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sales Tab */}
          {activeTab === 'sales' && (
            <div style={{ backgroundColor: COLORS.white, borderRadius: '16px', border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', borderBottom: `1px solid ${COLORS.border}`, backgroundColor: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: COLORS.dark }}>{filtered.length} Transactions</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC', borderBottom: `1px solid ${COLORS.border}` }}>
                      {['Receipt ID', 'Date & Time', 'Cashier', 'Items', 'Discount', 'Payment', 'Total'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: h === 'Total' ? 'right' : 'left', fontSize: '11px', fontWeight: 700, color: COLORS.slate, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((sale, idx) => (
                      <tr key={sale.id} style={{ borderBottom: `1px solid #F1F5F9`, backgroundColor: idx % 2 === 0 ? COLORS.white : '#FAFBFC' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: COLORS.dark }}>#{sale.id.toString().padStart(6, '0')}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: COLORS.slate }}>{formatDate(sale.saleDate)}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: COLORS.dark }}>{sale.cashierName}</td>
                        <td style={{ padding: '12px 16px' }}><span style={{ backgroundColor: '#F1F5F9', color: COLORS.slate, fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px' }}>{sale.items.reduce((s, i) => s + i.quantity, 0)}</span></td>
                        <td style={{ padding: '12px 16px', color: COLORS.orange, fontWeight: 600 }}>{sale.discount > 0 ? formatLKR(sale.discount) : '-'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 700, backgroundColor: sale.paymentMethod === 'CARD' ? COLORS.lightPurple : COLORS.lightGreen, color: sale.paymentMethod === 'CARD' ? COLORS.purple : COLORS.green }}>{sale.paymentMethod}</span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 800, color: COLORS.blue }}>{formatLKR(sale.totalAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {[
                { label: 'Cash Transactions', data: cashSales, color: COLORS.green, bg: COLORS.lightGreen, icon: '💵' },
                { label: 'Card Transactions', data: cardSales, color: COLORS.purple, bg: COLORS.lightPurple, icon: '💳' },
              ].map(pm => (
                <div key={pm.label} style={{ backgroundColor: COLORS.white, borderRadius: '16px', border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', backgroundColor: pm.bg, borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: pm.color }}>{pm.icon} {pm.label}</span>
                    <span style={{ fontWeight: 800, color: pm.color }}>{formatLKR(pm.data.reduce((s, x) => s + x.totalAmount, 0))}</span>
                  </div>
                  <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                    {pm.data.length === 0 ? (
                      <div style={{ padding: '40px', textAlign: 'center', color: COLORS.slate }}>No transactions</div>
                    ) : pm.data.map(sale => (
                      <div key={sale.id} style={{ padding: '12px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: COLORS.dark, fontSize: '13px' }}>#{sale.id.toString().padStart(6, '0')}</div>
                          <div style={{ fontSize: '12px', color: COLORS.slate }}>{formatDate(sale.saleDate)}</div>
                        </div>
                        <div style={{ fontWeight: 700, color: pm.color }}>{formatLKR(sale.totalAmount)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          button { display: none !important; }
        }
      `}</style>
    </div>
  );
}
