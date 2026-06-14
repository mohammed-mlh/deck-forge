import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteLayout } from "@/components/layout/site-layout";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { QueryProvider } from "@/providers/query-provider";
import { AnalyticsProvider } from "@/providers/analytics-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "DeckForge",
    template: "%s | DeckForge",
  },
  description: "The modern platform for competitive Yu-Gi-Oh deck building and analysis.",
  openGraph: {
    type: "website",
    siteName: "DeckForge",
    title: "DeckForge",
    description: "The modern platform for competitive Yu-Gi-Oh deck building and analysis.",
  },
  twitter: {
    card: "summary",
    title: "DeckForge",
    description: "The modern platform for competitive Yu-Gi-Oh deck building and analysis.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen antialiased">
        <ClerkProvider
          appearance={clerkAppearance}
          signInFallbackRedirectUrl="/deck-builder"
          signUpFallbackRedirectUrl="/deck-builder"
        >
          <QueryProvider>
            <AnalyticsProvider>
              <SiteLayout>{children}</SiteLayout>
            </AnalyticsProvider>
          </QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
