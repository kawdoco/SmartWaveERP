"use client";
import React, { useState, useEffect } from "react";
import { getStoredUser, userApi, UserDTO } from "@/lib/api";
import { AuthResponse } from "@/lib/api";
import { pageStyle, titleStyle } from "@/styles/sharedStyles";

const C = {
  blue: '#1D4ED8', lb: '#EFF6FF', bb: '#BFDBFE',
  red: '#DC2626', lr: '#FEF2F2', br: '#FEE2E2',
  green: '#16A34A', lg: '#F0FDF4', bg2: '#BBF7D0',
  orange: '#D97706', lo: '#FFFBEB', bo: '#FDE68A',
  slate: '#64748B', dark: '#0F172A', border: '#E2E8F0', white: '#FFFFFF', bg: '#F8FAFC'
};

const PRINTER_SIZES = [
  { id: '58mm', label: '58mm Thermal', desc: 'Compact receipt printer', icon: '🖨️' },
  { id: '80mm', label: '80mm Thermal', desc: 'Standard POS receipt', icon: '🖨️' },
  { id: '53mm', label: '53mm Thermal', desc: 'Mini receipt paper', icon: '🖨️' },
  { id: 'A4', label: 'A4 Paper', desc: 'Full-page document print', icon: '📄' },
  { id: 'A5', label: 'A5 Paper', desc: 'Half-page document', icon: '📄' },
];

const MODULE_PERMISSIONS = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'products', label: 'Products', icon: '📦' },
  { key: 'procurement', label: 'Procurement', icon: '🚚' },
  { key: 'inventory', label: 'Inventory', icon: '🏠' },
  { key: 'pos', label: 'Point of Sale', icon: '🛒' },
  { key: 'sales', label: 'Sales Ledger', icon: '🧾' },
  { key: 'reports', label: 'Reports', icon: '📈' },
  { key: 'users', label: 'User Management', icon: '👥' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
];

const ROLES = ['ADMIN', 'MANAGER', 'CASHIER', 'VIEWER'];

const DEFAULT_PERMS: Record<string, string[]> = {
  ADMIN: ['dashboard','products','procurement','inventory','pos','sales','reports','users','settings'],
  MANAGER: ['dashboard','products','procurement','inventory','pos','sales','reports'],
  CASHIER: ['dashboard','pos','sales'],
  VIEWER: ['dashboard','sales','reports'],
};

type Tab = 'general' | 'printer' | 'permissions' | 'about';

export default function SettingsPage() {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<Tab>('general');
  const [printerSize, setPrinterSize] = useState('80mm');
  const [printerName, setPrinterName] = useState('');
  const [currency, setCurrency] = useState('LKR');
  const [dateFormat, setDateFormat] = useState('en-LK');
  const [perms, setPerms] = useState<Record<string, string[]>>(DEFAULT_PERMS);
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    const u = getStoredUser();
    setUser(u);
    const admin = u?.role === 'ADMIN';
    setIsAdmin(admin);
    // Load all localStorage prefs client-side
    setPrinterSize(localStorage.getItem('sw_printer') || '80mm');
    setPrinterName(localStorage.getItem('sw_printer_name') || '');
    setCurrency(localStorage.getItem('sw_currency') || 'LKR');
    setDateFormat(localStorage.getItem('sw_date_fmt') || 'en-LK');
    const saved = localStorage.getItem('sw_perms');
    if (saved) try { setPerms(JSON.parse(saved)); } catch {}
    if (admin) userApi.getAll().then(setUsers).catch(() => {});
  }, []);

  const save = () => {
    localStorage.setItem('sw_printer', printerSize);
    localStorage.setItem('sw_printer_name', printerName);
    localStorage.setItem('sw_currency', currency);
    localStorage.setItem('sw_date_fmt', dateFormat);
    setSavedMsg('Settings saved!');
    setTimeout(() => setSavedMsg(''), 2500);
  };

  const togglePerm = (role: string, key: string) => {
    setPerms(prev => {
      const arr = prev[role] || [];
      const next = arr.includes(key) ? arr.filter(k => k !== key) : [...arr, key];
      const updated = { ...prev, [role]: next };
      localStorage.setItem('sw_perms', JSON.stringify(updated));
      return updated;
    });
  };

  const resetPerms = () => {
    setPerms(DEFAULT_PERMS);
    localStorage.setItem('sw_perms', JSON.stringify(DEFAULT_PERMS));
    setSavedMsg('Permissions reset to defaults!');
    setTimeout(() => setSavedMsg(''), 2500);
  };

  const tabs: { id: Tab; label: string; icon: string; adminOnly?: boolean }[] = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'printer', label: 'Printer', icon: '🖨️' },
    { id: 'permissions', label: 'Permissions', icon: '🔒', adminOnly: true },
    { id: 'about', label: 'About', icon: 'ℹ️' },
  ];

  const visibleTabs = tabs.filter(t => !t.adminOnly || isAdmin);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ backgroundColor: C.white, borderRadius: '16px', border: `1px solid ${C.border}`, overflow: 'hidden', marginBottom: '20px' }}>
      <div style={{ padding: '16px 24px', borderBottom: `1px solid ${C.border}`, backgroundColor: C.bg }}>
        <h3 style={{ margin: 0, fontWeight: 700, color: C.dark, fontSize: '15px' }}>{title}</h3>
      </div>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  );

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>{label}</label>
      {children}
    </div>
  );

  const inp: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    border: `1px solid ${C.border}`, outline: 'none', fontSize: '14px', boxSizing: 'border-box'
  };

  return (
    <div style={pageStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', borderBottom: `1px solid ${C.border}`, paddingBottom: '24px' }}>
        <div>
          <h1 style={titleStyle}>Settings</h1>
          <p style={{ color: C.slate, margin: 0, fontWeight: 500 }}>Configure your ERP system preferences.</p>
        </div>
        {isAdmin && (
          <span style={{ backgroundColor: C.lr, color: C.red, border: `1px solid ${C.br}`, padding: '4px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: 700 }}>
            🔐 Admin Mode
          </span>
        )}
      </div>

      {savedMsg && (
        <div style={{ marginBottom: '20px', padding: '12px 20px', backgroundColor: C.lg, border: `1px solid ${C.bg2}`, borderRadius: '12px', color: C.green, fontWeight: 700 }}>
          ✅ {savedMsg}
        </div>
      )}

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Sidebar tabs */}
        <div style={{ width: '200px', flexShrink: 0 }}>
          <div style={{ backgroundColor: C.white, borderRadius: '16px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            {visibleTabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                padding: '13px 18px', border: 'none', cursor: 'pointer', textAlign: 'left',
                fontWeight: tab === t.id ? 700 : 500, fontSize: '14px',
                backgroundColor: tab === t.id ? C.lb : 'transparent',
                color: tab === t.id ? C.blue : C.slate,
                borderLeft: tab === t.id ? `3px solid ${C.blue}` : '3px solid transparent',
                transition: 'all 0.15s'
              }}>
                <span>{t.icon}</span>{t.label}
                {t.adminOnly && <span style={{ marginLeft: 'auto', fontSize: '10px', backgroundColor: C.lr, color: C.red, padding: '1px 6px', borderRadius: '99px', fontWeight: 700 }}>ADMIN</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>

          {/* GENERAL TAB */}
          {tab === 'general' && (
            <>
              <Section title="Regional Preferences">
                <Field label="Currency">
                  <select value={currency} onChange={e => setCurrency(e.target.value)} style={inp}>
                    <option value="LKR">🇱🇰 Sri Lankan Rupee (LKR)</option>
                    <option value="USD">🇺🇸 US Dollar (USD)</option>
                    <option value="EUR">🇪🇺 Euro (EUR)</option>
                    <option value="GBP">🇬🇧 British Pound (GBP)</option>
                  </select>
                </Field>
                <Field label="Date Format">
                  <select value={dateFormat} onChange={e => setDateFormat(e.target.value)} style={inp}>
                    <option value="en-LK">DD/MM/YYYY (en-LK)</option>
                    <option value="en-US">MM/DD/YYYY (en-US)</option>
                    <option value="en-GB">DD/MM/YYYY (en-GB)</option>
                  </select>
                </Field>
              </Section>
              <Section title="Business Info">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Business Name">
                    <input defaultValue="SmartWave ERP" style={inp} />
                  </Field>
                  <Field label="Tax ID / BRN">
                    <input placeholder="e.g. VAT123456" style={inp} />
                  </Field>
                </div>
                <Field label="Business Address">
                  <input placeholder="Enter business address" style={inp} />
                </Field>
              </Section>
              <button onClick={save} className="bg-[#1D4ED8] text-white hover:bg-[#1e40af] px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm">
                Save Changes
              </button>
            </>
          )}

          {/* PRINTER TAB */}
          {tab === 'printer' && (
            <>
              <Section title="Printer Selection">
                <p style={{ color: C.slate, fontSize: '14px', marginTop: 0, marginBottom: '20px' }}>
                  Choose the paper/receipt size for POS and document printing.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                  {PRINTER_SIZES.map(p => (
                    <div key={p.id} onClick={() => setPrinterSize(p.id)} style={{
                      padding: '16px', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s',
                      border: `2px solid ${printerSize === p.id ? C.blue : C.border}`,
                      backgroundColor: printerSize === p.id ? C.lb : C.white,
                    }}>
                      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{p.icon}</div>
                      <div style={{ fontWeight: 700, color: printerSize === p.id ? C.blue : C.dark, fontSize: '15px' }}>{p.label}</div>
                      <div style={{ fontSize: '12px', color: C.slate, marginTop: '4px' }}>{p.desc}</div>
                      {printerSize === p.id && (
                        <div style={{ marginTop: '10px', fontSize: '11px', fontWeight: 700, color: C.blue }}>✓ Selected</div>
                      )}
                    </div>
                  ))}
                </div>
                <Field label="Printer Name / Port (optional)">
                  <input value={printerName} onChange={e => setPrinterName(e.target.value)} placeholder="e.g. EPSON TM-T88, COM3, or USB001" style={inp} />
                </Field>
                <div style={{ padding: '16px', backgroundColor: C.lb, borderRadius: '12px', border: `1px solid ${C.bb}`, fontSize: '13px', color: C.blue, fontWeight: 600, marginBottom: '20px' }}>
                  📄 Currently selected: <strong>{printerSize}</strong> paper size
                  {printerName && <> · Printer: <strong>{printerName}</strong></>}
                </div>
              </Section>
              <Section title="Receipt Template">
                <Field label="Receipt Header Text">
                  <input defaultValue="SmartWave ERP — Thank you for your purchase!" style={inp} />
                </Field>
                <Field label="Receipt Footer Text">
                  <input defaultValue="Goods once sold will not be taken back." style={inp} />
                </Field>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, color: C.dark }}>
                    <input type="checkbox" defaultChecked /> Print barcode on receipt
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, color: C.dark }}>
                    <input type="checkbox" defaultChecked /> Show cashier name
                  </label>
                </div>
              </Section>
              <button onClick={save} className="bg-[#1D4ED8] text-white hover:bg-[#1e40af] px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm">
                Save Printer Settings
              </button>
            </>
          )}

          {/* PERMISSIONS TAB — Admin Only */}
          {tab === 'permissions' && isAdmin && (
            <>
              <div style={{ marginBottom: '20px', padding: '14px 20px', backgroundColor: C.lr, border: `1px solid ${C.br}`, borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '20px' }}>🔐</span>
                <div>
                  <div style={{ fontWeight: 700, color: C.red, fontSize: '14px' }}>Admin-Only: Permission Access Controller</div>
                  <div style={{ fontSize: '13px', color: '#9F1239', marginTop: '2px' }}>
                    Control which roles can access each module. Changes take effect on next login.
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: C.white, borderRadius: '16px', border: `1px solid ${C.border}`, overflow: 'auto', marginBottom: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ backgroundColor: C.bg, borderBottom: `1px solid ${C.border}` }}>
                      <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Module</th>
                      {ROLES.map(role => (
                        <th key={role} style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: role === 'ADMIN' ? C.red : role === 'MANAGER' ? C.blue : role === 'CASHIER' ? C.green : C.slate }}>
                          {role}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MODULE_PERMISSIONS.map((mod, idx) => (
                      <tr key={mod.key} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: idx % 2 === 0 ? C.white : '#FAFBFC' }}>
                        <td style={{ padding: '14px 20px', fontWeight: 600, color: C.dark }}>
                          <span style={{ marginRight: '10px' }}>{mod.icon}</span>{mod.label}
                        </td>
                        {ROLES.map(role => {
                          const hasAccess = (perms[role] || []).includes(mod.key);
                          const isLocked = role === 'ADMIN'; // Admin always has full access
                          return (
                            <td key={role} style={{ padding: '14px 16px', textAlign: 'center' }}>
                              <button
                                disabled={isLocked}
                                onClick={() => togglePerm(role, mod.key)}
                                title={isLocked ? 'Admin always has full access' : `Toggle ${mod.label} for ${role}`}
                                style={{
                                  width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: isLocked ? 'not-allowed' : 'pointer',
                                  backgroundColor: hasAccess ? (role === 'ADMIN' ? C.lr : C.lg) : '#F1F5F9',
                                  color: hasAccess ? (role === 'ADMIN' ? C.red : C.green) : C.slate,
                                  fontSize: '16px', transition: 'all 0.2s', opacity: isLocked ? 0.7 : 1
                                }}
                              >
                                {hasAccess ? '✓' : '✗'}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* User Role Overview */}
              {users.length > 0 && (
                <Section title="Current Users & Roles">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
                    {users.map(u => (
                      <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: `1px solid ${C.border}`, backgroundColor: C.bg }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: u.role === 'ADMIN' ? C.lr : C.lb, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: u.role === 'ADMIN' ? C.red : C.blue, fontSize: '14px' }}>
                          {u.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, color: C.dark, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.fullName}</div>
                          <div style={{ fontSize: '11px', color: C.slate }}>{u.username}</div>
                        </div>
                        <span style={{
                          padding: '2px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 700,
                          backgroundColor: u.role === 'ADMIN' ? C.lr : u.role === 'MANAGER' ? C.lb : u.role === 'CASHIER' ? C.lg : C.lo,
                          color: u.role === 'ADMIN' ? C.red : u.role === 'MANAGER' ? C.blue : u.role === 'CASHIER' ? C.green : C.orange
                        }}>{u.role}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={resetPerms} className="bg-[#1D4ED8] text-white hover:bg-[#1e40af] px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm">
                  Reset Defaults
                </button>
                <button onClick={() => { localStorage.setItem('sw_perms', JSON.stringify(perms)); setSavedMsg('Permissions saved!'); setTimeout(() => setSavedMsg(''), 2500); }} className="bg-[#1D4ED8] text-white hover:bg-[#1e40af] px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm">
                  Save Permissions
                </button>
              </div>
            </>
          )}

          {/* ABOUT TAB */}
          {tab === 'about' && (
            <Section title="About SmartWave ERP">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                {[
                  { label: 'Version', value: '1.0.0 Stable' },
                  { label: 'Environment', value: 'Production' },
                  { label: 'Logged in as', value: user?.fullName || 'Unknown' },
                  { label: 'Role', value: user?.role || '-' },
                  { label: 'Backend', value: 'Spring Boot 3.x' },
                  { label: 'Frontend', value: 'Next.js 14' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ padding: '14px 18px', backgroundColor: C.bg, borderRadius: '12px', border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontWeight: 700, color: C.dark }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '16px 20px', backgroundColor: C.lb, borderRadius: '12px', border: `1px solid ${C.bb}`, fontSize: '13px', color: C.blue, lineHeight: 1.6 }}>
                <strong>SmartWave ERP</strong> — Enterprise resource planning system designed for efficient business management.
                Built with Next.js, Spring Boot, and Java.
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}
