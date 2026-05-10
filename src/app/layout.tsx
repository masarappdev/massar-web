import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { PwaRegister } from "@/components/PwaRegister";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#007AFF",
};

export const metadata: Metadata = {
  title: "مسار - Massar",
  description: "بوابتك لعمل أسهل وأرباح تتخطى التوقعات",
  keywords: ["delivery", "delegate", "courier", "logistics", "مندوب", "توصيل", "مسار", "massar"],
  authors: [{ name: "Massar Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "مسار - Massar",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    title: "مسار - Massar",
    description: "بوابتك لعمل أسهل وأرباح تتخطى التوقعات",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} antialiased`} style={cairo.style}>
        <div className="mobile-container">
          {children}
        </div>
        <Toaster />
        <PwaRegister />
      </body>
    </html>
  );
}
