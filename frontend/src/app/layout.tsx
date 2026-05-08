import type { Metadata } from 'next';
import './globals.css';
import AppLayout from '../components/AppLayout';
import Chatbot from '../components/Chatbot';
export const metadata: Metadata = {
  title: 'SmartWave ERP',
  description: 'Enterprise Resource Planning System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <AppLayout>{children}</AppLayout>
        <Chatbot />
      </body>
    </html>
  );
}