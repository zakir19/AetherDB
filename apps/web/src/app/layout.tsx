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
    default: "Aether — AI Database Schema Builder",
    template: "%s | Aether",
  },
  description:
    "Generate production-ready PostgreSQL schemas, TypeScript types, ERD diagrams, and API routes instantly with AI.",
  keywords: [
    "AI", "Database", "Schema", "PostgreSQL", "TypeScript",
    "ERD", "API", "Generator", "Builder",
  ],
  authors: [{ name: "Aether" }],
  creator: "Aether",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aether-db.dev",
    title: "Aether — AI Database Schema Builder",
    description: "Generate production-ready database schemas instantly with AI.",
    siteName: "Aether",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aether — AI Database Schema Builder",
    description: "Generate production-ready database schemas instantly with AI.",
    creator: "@aether_db",
  },
  metadataBase: new URL("https://aether-db.dev"),
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
