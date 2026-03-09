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
    "SaaS de sandbox API pour agents IA : testez Stripe, paiements crypto (USDC), webhooks et scénarios d'échec (500, timeouts, rate limit) sans jamais toucher à la production. Logs en temps réel, quotas maîtrisés, intégration rapide.",
  openGraph: {
    type: "website",
    title: "Sandbox AI — Simulateur d'API pour agents IA",
    description:
      "Sandbox API pour agents IA : Stripe, paiements crypto, webhooks et scénarios d'échec, le tout hors production pour tester vos intégrations en sécurité.",
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
          <script
            defer
            data-domain="mon-saas-ia.vercel.app"
            src="https://plausible.io/js/script.js"
          />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
