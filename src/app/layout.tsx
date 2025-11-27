import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { frFR } from '@clerk/localizations'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Visual Marketing SaaS",
  description: "AI-powered visual marketing analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={frFR}>
      <html lang="fr">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
