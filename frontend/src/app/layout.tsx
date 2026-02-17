import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
/* this is a test comment */
export const metadata: Metadata = {
  title: "SmartWave ERP - Enterprise Resource Planning",
  description: "Modern enterprise resource planning system for streamlined business operations",
  keywords: ["ERP", "Enterprise", "Business Management", "SmartWave"],
  authors: [{ name: "SmartWave Technologies" }],
  openGraph: {
    title: "SmartWave ERP",
    description: "Modern enterprise resource planning system",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
