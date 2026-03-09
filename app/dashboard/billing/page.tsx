"use client";

import { useState, useEffect } from "react";
import { CreditCard, Check, Zap, Loader2 } from "lucide-react";
import Link from "next/link";

const PLANS = [
  {
    name: "Sandbox",
    price: "0",
    period: "/mois",
    current: true,
    features: ["500 requêtes/mois", "1 API (Stripe)", "24h de logs"],
  },
  {
    name: "Pro",
    price: "49",
    period: "/mois",
    current: false,
    popular: true,
    features: ["50 000 requêtes/mois", "Toutes les APIs", "Mode Chaos", "30 jours de logs"],
  },
  {
    name: "Scale",
    price: "199",
    period: "/mois",
    current: false,
    features: ["Requêtes illimitées", "Environnements multiples", "APIs sur-mesure", "Support prioritaire"],
  },
];

export default function BillingPage() {
  const [proLoading, setProLoading] = useState(false);
  const [message, setMessage] = useState<"success" | "canceled" | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    if (params.get("success") === "1") setMessage("success");
    if (params.get("canceled") === "1") setMessage("canceled");
  }, []);

  const handleProCheckout = async () => {
    if (proLoading) return;
    setProLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout-session", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (res.status === 503) {
        window.location.href = "/contact?subject=Plan%20Pro";
        return;
      }
    } finally {
      setProLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          Facturation
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Plan actuel et gestion de l&apos;abonnement.
        </p>
      </div>

      {message === "success" && (
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          Paiement réussi. Votre accès Pro est actif.
        </div>
      )}
      {message === "canceled" && (
        <div className="mb-6 rounded-xl border border-slate-500/30 bg-white/5 p-4 text-sm text-slate-400">
          Paiement annulé. Vous pouvez réessayer quand vous voulez.
        </div>
      )}

      <section aria-labelledby="current-plan-title" className="mb-10">
        <h2 id="current-plan-title" className="mb-4 text-lg font-bold tracking-tight text-white">
          Votre plan
        </h2>
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/20">
              <Zap className="h-6 w-6 text-indigo-400" aria-hidden />
            </div>
            <div>
              <p className="font-semibold text-white">Sandbox</p>
              <p className="text-sm text-slate-400">Gratuit · 500 requêtes/mois</p>
            </div>
            <span className="ml-auto rounded-full border border-indigo-500/50 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
              Actuel
            </span>
          </div>
        </div>
      </section>

      <section aria-labelledby="plans-title">
        <h2 id="plans-title" className="mb-4 text-lg font-bold tracking-tight text-white">
          Changer de plan
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-xl border bg-white/[0.02] p-6 backdrop-blur-md ${
                plan.popular ? "border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.08)]" : "border-white/5"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-2.5 py-0.5 text-xs font-medium text-white">
                  Populaire
                </span>
              )}
              <div className="mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-slate-500" aria-hidden />
                <h3 className="font-bold text-white">{plan.name}</h3>
              </div>
              <div className="mb-4 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">{plan.price}€</span>
                <span className="text-slate-500">{plan.period}</span>
              </div>
              <ul className="mb-6 flex-1 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              {plan.current ? (
                <span className="block text-center text-sm text-slate-500">Plan actuel</span>
              ) : plan.name === "Pro" ? (
                <button
                  type="button"
                  onClick={handleProCheckout}
                  disabled={proLoading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-50"
                >
                  {proLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Redirection…
                    </>
                  ) : (
                    "Passer à Pro"
                  )}
                </button>
              ) : (
                <Link
                  href="/contact?subject=Plan%20Scale"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  Contacter les ventes
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      <p className="mt-8 text-center text-xs text-slate-500">
        Paiement sécurisé par Stripe. Configurez <code className="rounded bg-white/10 px-1">STRIPE_SECRET_KEY</code> et <code className="rounded bg-white/10 px-1">STRIPE_PRO_PRICE_ID</code> pour activer le passage au plan Pro.
      </p>
    </>
  );
}
