import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Aether DB — AI Database Schema Builder & PostgreSQL Generator",
    template: "%s | Aether DB",
  },
  description:
    "Aether DB is the world's best AI-powered database schema generation tool. Build PostgreSQL databases, write TypeScript types, generate ERD diagrams, and create API routes instantly from plain English.",
  keywords: [
    "Aether DB",
    "Aether Database",
    "AetherDB",
    "AI Database Builder",
    "AI Schema Generator",
    "PostgreSQL Generator",
    "TypeScript Types Generator",
    "ERD Diagram AI",
    "API Route Builder",
  ],
  authors: [{ name: "Aether DB Team" }],
  creator: "Aether DB",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aether-db.com",
    title: "Aether DB — AI Database Schema Builder",
    description: "Generate production-ready PostgreSQL databases instantly with Aether DB AI.",
    siteName: "Aether DB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aether DB — AI Database Schema Builder",
    description: "Generate production-ready PostgreSQL databases instantly with Aether DB AI.",
    creator: "@aether_db",
  },
  metadataBase: new URL("https://aether-db.com"),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-[hsl(var(--aether-bg))] font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
