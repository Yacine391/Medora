import type { Metadata, Viewport } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Medora — AI against hospital medicine waste",
  description:
    "Medora uses AI to compute the optimal medicine order quantity from hospital historical data — cutting waste, CO₂ and costs at the source.",
  openGraph: {
    title: "Medora — AI against hospital medicine waste",
    description:
      "Stop over-ordering. Medora analyses 24 months of hospital order history to give every pharmacist the exact quantity to order — saving €1.7B/year and 1Mt CO₂e in France alone.",
    type: "website",
    locale: "en_US",
    siteName: "Medora",
  },
  twitter: {
    card: "summary_large_image",
    title: "Medora — AI against hospital medicine waste",
    description:
      "Stop over-ordering. Medora analyses hospital data locally and recommends the optimal order quantity — HDS & RGPD compliant.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10b981",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-jakarta)]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
