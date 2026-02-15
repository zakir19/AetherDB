import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ClientEasterEggs } from "@/components/easter-eggs/client-easter-eggs";

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
    default: "Aether UI — Components Forged Beyond Reality",
    template: "%s | Aether UI",
  },
  description:
    "The ultimate component library for 2026. React 19, TypeScript 5.5, Tailwind v4, Radix primitives, Framer Motion, and Three.js — fused into pure digital art.",
  keywords: [
    "UI library", "React", "components", "Tailwind CSS", "Radix",
    "Framer Motion", "Three.js", "design system", "2026",
  ],
  authors: [{ name: "Aether UI" }],
  creator: "Aether UI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aether-ui.dev",
    title: "Aether UI — Components Forged Beyond Reality",
    description: "The last component library you'll ever need.",
    siteName: "Aether UI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aether UI — Components Forged Beyond Reality",
    description: "The last component library you'll ever need.",
    creator: "@aether_ui",
  },
  metadataBase: new URL("https://aether-ui.dev"),
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
          <SmoothScroll>
            {children}
          </SmoothScroll>
          <ClientEasterEggs />
        </Providers>
      </body>
    </html>
  );
}
