"use client";

import { usePathname } from 'next/navigation';
import Sidebar from '../components/Sidebar Navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <div style={{ display: 'flex' }}>
          {/* Hides Sidebar on Login Route */}
          {!isLoginPage && <Sidebar />}

          <main style={{ 
            flex: 1, 
            marginLeft: isLoginPage ? '0' : '260px', 
            minHeight: '100vh',
            backgroundColor: '#F9FAFB' 
          }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}