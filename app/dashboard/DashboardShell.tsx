"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Key,
  ScrollText,
  Settings,
  CreditCard,
  FileText,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/dashboard/keys", label: "Clés API", icon: Key },
  { href: "/dashboard/logs", label: "Logs des Agents", icon: ScrollText },
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
  { href: "/dashboard/billing", label: "Facturation", icon: CreditCard },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] font-sans text-slate-300 antialiased">
      <aside
        className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/5 bg-[#111] lg:flex"
        aria-label="Menu principal"
      >
        <div className="flex h-14 items-center border-b border-white/5 px-5">
          <Link
            href="/"
            aria-label="Sandbox AI, retour à l'accueil"
            className="text-lg font-bold tracking-tight text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Sandbox AI
          </Link>
        </div>
        <nav className="flex-1 space-y-0.5 p-3" aria-label="Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-label={item.label}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
                      active
                        ? "bg-white/5 text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden />
                    {item.label}
                  </Link>
                );
          })}
        </nav>
      </aside>

      {/* Mobile overlay + drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            aria-hidden
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/5 bg-[#111] lg:hidden">
            <div className="flex h-14 items-center justify-between border-b border-white/5 px-5">
              <span className="text-lg font-bold text-white">Sandbox AI</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-3 text-slate-400 hover:bg-white/5 hover:text-white"
                aria-label="Fermer le menu"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    aria-label={item.label}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                      active ? "bg-white/5 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </>
      )}

      <div className="flex-1 lg:pl-64">
        <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-3 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-6 w-6" aria-hidden />
            </button>
            <div className="flex flex-1 items-center justify-end gap-3">
              <a
                href="/guide"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
                aria-label="Ouvrir le Guide API"
              >
                <FileText className="h-4 w-4 shrink-0" aria-hidden />
                Guide API
              </a>
              <UserButton />
            </div>
          </div>
          <main id="dashboard-main">{children}</main>
        </div>
      </div>
    </div>
  );
}
