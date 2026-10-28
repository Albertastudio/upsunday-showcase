import type { Metadata, Viewport } from "next";
import { Syne, Inter, JetBrains_Mono } from "next/font/google";
import SmoothScrollProvider from "@/components/providers/SmoothScroll";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://albertastudio.dev"),
  title: "Alberta Studio — Form Follows Performance | Creative Engineering",
  description:
    "Production-grade digital flagships engineered for design-led companies. 60fps kinetic motion, zero layout shift (CLS = 0.00), and sub-second LCP on Next.js App Router.",
  keywords: [
    "creative development",
    "boutique design studio",
    "Alberta Studio",
    "high-performance web",
    "Next.js App Router",
    "GSAP kinetic typography",
    "Lenis smooth scroll",
    "Lighthouse 100",
  ],
  authors: [{ name: "Alberta Studio", url: "https://albertastudio.dev" }],
  creator: "Alberta Studio",
  openGraph: {
    title: "Alberta Studio — Form Follows Performance",
    description:
      "Awwwards-level digital experiences engineered with 60fps kinetic typography, sub-second LCP, and zero layout shift.",
    url: "https://albertastudio.dev",
    siteName: "Alberta Studio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alberta Studio — Form Follows Performance",
    description:
      "Awwwards-level digital experiences engineered with 60fps kinetic typography, sub-second LCP, and zero layout shift.",
    creator: "@albertastudio",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${inter.variable} ${jetbrainsMono.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
