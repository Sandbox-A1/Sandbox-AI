import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
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
  title: {
    default: "Sandbox AI — Simulateur d'API pour agents IA",
    template: "%s | Sandbox AI",
  },
  description:
    "SaaS de simulation d'API pour agents IA : testez Stripe, e-commerce et webhooks sans toucher à la production. Réponses réalistes, logs en temps réel, zéro risque.",
  openGraph: {
    type: "website",
    title: "Sandbox AI — Simulateur d'API pour agents IA",
    description:
      "SaaS de simulation d'API pour agents IA : testez Stripe, e-commerce et webhooks sans toucher à la production. Réponses réalistes, logs en temps réel, zéro risque.",
    siteName: "Sandbox AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
