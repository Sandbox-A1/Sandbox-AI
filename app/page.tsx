"use client";

import { useState } from "react";
import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

type LogEntry = {
  id: string;
  time: string;
  agent: string;
  action: string;
  status: "200 OK" | "401 Error";
};

const features = [
  {
    title: "Protégez votre production",
    description:
      "Laissez vos agents IA frapper une sandbox plutôt que vos vraies APIs. Pas de données sensibles, pas de paiements réels, idéal pour le dev et le staging.",
  },
  {
    title: "Comprenez ce que fait l’agent",
    description:
      "Chaque appel est loggé : heure, agent, endpoint, statut. Vous voyez exactement comment l’agent consomme vos APIs et où il échoue.",
  },
  {
    title: "Scénarios d’échec sur-mesure",
    description:
      "Injectez des 500, des timeouts, du rate limiting ou une carte refusée. Durcissez vos prompts et vos flux avant d’ouvrir la porte à la prod.",
  },
];

const pricingPlans = [
  {
    name: "Sandbox",
    price: "0",
    period: "/mois",
    subtitle: "Pour valider vos intégrations agents IA.",
    features: [
      "500 requêtes/mois",
      "Stripe sandbox prête à l’emploi",
      "24h de rétention des logs",
    ],
    cta: "Commencer gratuitement",
    primary: false,
    popular: false,
  },
  {
    name: "Pro",
    price: "49",
    period: "/mois",
    subtitle: "Pour les startups et ingénieurs IA.",
    features: [
      "50 000 requêtes/mois",
      "Stripe + Crypto (USDC) + webhooks",
      "Scénarios d’erreur avancés (500, 402, 429, latence)",
      "30 jours de logs",
    ],
    cta: "Démarrer l'essai Pro",
    primary: true,
    popular: true,
  },
  {
    name: "Scale",
    price: "199",
    period: "/mois",
    subtitle: "Pour les équipes IA en production.",
    features: [
      "Quota adapté à votre volumétrie",
      "Environnements isolés multiples (preprod, QA, clients)",
      "APIs sandbox sur-mesure",
      "Support prioritaire Slack",
    ],
    cta: "Contacter les ventes",
    primary: false,
    popular: false,
  },
];

export default function Home() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateAgent = async () => {
    if (isSimulating) return;
    setIsSimulating(true);

    const now = new Date();
    const formattedTime = now.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    let status: LogEntry["status"] = "401 Error";

    try {
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_api_key: "sk_test_123",
          amount: 5000,
        }),
      });

      status = response.ok ? "200 OK" : "401 Error";
    } catch {
      status = "401 Error";
    } finally {
      setLogs((previous) => [
        {
          id: crypto.randomUUID(),
          time: formattedTime,
          agent: "Agent IA (test)",
          action: "Paiement Stripe simulé",
          status,
        },
        ...previous,
      ]);
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans text-slate-300 antialiased">
      <header className="border-b border-slate-800 bg-[#0A0A0A]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <a href="/" aria-label="Sandbox AI, accueil" className="text-base font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
            Sandbox AI
          </a>
          <nav className="flex items-center gap-6" aria-label="Navigation principale">
            <a href="#demo" className="text-sm text-slate-500 transition hover:text-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Démo</a>
            <a href="#pricing" className="text-sm text-slate-500 transition hover:text-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Tarifs</a>
            <a href="/guide" className="text-sm text-slate-500 transition hover:text-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Guide API</a>
            <Show when="signed-in">
              <Link href="/dashboard" className="text-sm font-medium text-slate-400 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500" aria-label="Dashboard">Dashboard</Link>
            </Show>
          </nav>
          <div className="flex items-center gap-2">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button type="button" className="text-sm font-medium text-slate-400 transition hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]" aria-label="Se connecter">Se connecter</button>
              </SignInButton>
              <a href="#demo" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]" aria-label="Essayer la démo">Essayer la démo</a>
            </Show>
            <Show when="signed-in">
              <Link href="/dashboard" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]" aria-label="Dashboard">Dashboard</Link>
              <UserButton />
            </Show>
          </div>
        </div>
      </header>

      <main>
        {/* Hero — value prop B2B, une colonne + aperçu API */}
        <section id="hero" className="mx-auto max-w-6xl px-4 pt-16 pb-20 md:px-6 md:pt-24 md:pb-28" aria-labelledby="hero-title">
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16 lg:items-start">
            <div className="lg:col-span-3">
              <h1 id="hero-title" className="text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-[2.5rem] lg:leading-tight">
                Des API de test pour vos agents IA. Zéro appel en production.
              </h1>
              <p className="mt-5 max-w-lg text-base text-slate-400 md:text-lg">
                Simulez Stripe, e-commerce et webhooks. Réponses réalistes, logs en temps réel, mode Chaos pour la résilience. Idéal pour le développement et le CI/CD.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-3">
                  <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden />
                  Aucune donnée réelle, aucun paiement réel
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden />
                  500 requêtes/mois offertes sur le plan Sandbox
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden />
                  Clé API en quelques clics, intégration en minutes
                </li>
              </ul>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <a href="#demo" className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]" aria-label="Voir la démo">Voir la démo</a>
                <a href="/guide" className="inline-flex items-center justify-center rounded-md border border-slate-600 bg-transparent px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:bg-white/5 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]" aria-label="Guide API">Guide API</a>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-lg border border-slate-800 bg-slate-900/50 font-mono text-sm">
                <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-2.5">
                  <span className="h-2 w-2 rounded-full bg-slate-600" aria-hidden />
                  <span className="h-2 w-2 rounded-full bg-slate-600" aria-hidden />
                  <span className="h-2 w-2 rounded-full bg-slate-600" aria-hidden />
                  <span className="ml-2 text-xs text-slate-500">POST /api/stripe</span>
                </div>
                <pre className="overflow-x-auto p-4 text-slate-400"><code>{`curl -X POST "https://api.sandbox-ai.com/api/stripe" \\
  -H "Authorization: Bearer sk_..." \\
  -H "Content-Type: application/json" \\
  -d '{"amount": 5000}'`}</code></pre>
                <div className="border-t border-slate-800 px-4 py-2.5">
                  <span className="text-xs text-emerald-500/90">200 OK</span>
                  <span className="ml-2 text-xs text-slate-500">{"{ \"success\": true, ... }"}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Demo — Console type terminal */}
        <section
          id="demo"
          className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24"
          aria-labelledby="demo-title"
        >
          <div className="mx-auto max-w-5xl">
            <h2
              id="demo-title"
              className="mb-2 text-center text-2xl font-bold tracking-tight text-white md:text-3xl"
            >
              Démo en direct
            </h2>
            <p className="mb-8 text-center text-slate-400">
              Simulez un appel API depuis un agent IA. Chaque clic envoie une
              requête vers notre sandbox Stripe.
            </p>

            <div className="mb-4 flex justify-center">
              <button
                type="button"
                onClick={handleSimulateAgent}
                disabled={isSimulating}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-md transition hover:bg-indigo-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Simuler un paiement par l'agent IA"
              >
                <span>🤖 Simuler un paiement par l&apos;Agent IA</span>
                {isSimulating && (
                  <span
                    className="h-2 w-2 animate-pulse rounded-full bg-white"
                    aria-hidden
                  />
                )}
              </button>
            </div>

            <div
              className="overflow-hidden rounded-2xl border border-white/10 bg-slate-800/50 shadow-2xl backdrop-blur-sm"
              role="region"
              aria-label="Console des logs d'appels API"
            >
              {/* Barre type terminal */}
              <div className="flex items-center gap-2 border-b border-white/10 bg-slate-900/80 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-[#ff5f56]" aria-hidden />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" aria-hidden />
                <span className="h-3 w-3 rounded-full bg-[#27c93f]" aria-hidden />
                <span className="ml-4 font-mono text-xs text-slate-500">
                  Sandbox AI — Console
                </span>
              </div>

              <div className="overflow-x-auto font-mono text-sm">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        Heure
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        Agent
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        Action simulée
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {logs.length === 0 ? (
                      <tr>
                        <td className="px-4 py-5 text-slate-500">—</td>
                        <td className="px-4 py-5 text-slate-500">—</td>
                        <td className="px-4 py-5 text-slate-500">
                          Cliquez sur le bouton au-dessus pour générer un log
                        </td>
                        <td className="px-4 py-5">
                          <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-slate-500">
                            —
                          </span>
                        </td>
                      </tr>
                    ) : (
                      logs.map((log) => (
                        <tr
                          key={log.id}
                          className="transition hover:bg-white/[0.03]"
                        >
                          <td className="px-4 py-3 text-slate-400">
                            {log.time}
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            {log.agent}
                          </td>
                          <td className="px-4 py-3 text-slate-400">
                            {log.action}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded px-2 py-0.5 font-medium ${
                                log.status === "200 OK"
                                  ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
                                  : "bg-red-500/15 text-red-400 ring-1 ring-red-500/30"
                              }`}
                              role="status"
                              aria-label={`Statut HTTP : ${log.status}`}
                            >
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Features — Bento Grid */}
        <section
          className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24"
          aria-labelledby="features-title"
        >
          <h2
            id="features-title"
            className="mb-2 text-center text-2xl font-bold tracking-tight text-white md:text-3xl"
          >
            Pourquoi Sandbox AI ?
          </h2>
          <p className="mb-12 text-center text-slate-400">
            Conçu pour les équipes qui font confiance à leurs agents IA.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md transition hover:border-white/10 hover:bg-white/[0.04]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                  <span className="text-lg font-bold" aria-hidden>
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold tracking-tight text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section
          id="pricing"
          className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24"
          aria-labelledby="pricing-title"
        >
          <h2
            id="pricing-title"
            className="mb-2 text-center text-2xl font-bold tracking-tight text-white md:text-3xl"
          >
            Tarifs
          </h2>
          <p className="mb-12 text-center text-slate-400">
            Un plan gratuit pour démarrer, des offres Pro et Scale pour les
            équipes exigeantes.
          </p>

          <div className="grid gap-6 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <article
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border bg-white/[0.02] p-6 backdrop-blur-md transition hover:bg-white/[0.04] ${
                  plan.popular
                    ? "border-indigo-500/50 shadow-[0_0_40px_rgba(99,102,241,0.12)] lg:-mt-1 lg:mb-1 lg:scale-[1.02]"
                    : "border-white/5 hover:border-white/10"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-indigo-500 px-3 py-1 text-xs font-medium text-white">
                      Le plus populaire
                    </span>
                  </div>
                )}
                <div className="mb-5">
                  <h3 className="text-lg font-bold tracking-tight text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">{plan.subtitle}</p>
                </div>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">
                    {plan.price}€
                  </span>
                  <span className="text-slate-500">{plan.period}</span>
                </div>
                <ul className="mb-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-slate-300"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  {plan.primary ? (
                    <Link
                      href="/dashboard/billing"
                      className="inline-flex w-full items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
                      aria-label={plan.cta}
                    >
                      {plan.cta}
                    </Link>
                  ) : plan.name === "Scale" ? (
                    <Link
                      href="/contact?subject=Plan%20Scale"
                      className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
                      aria-label={plan.cta}
                    >
                      {plan.cta}
                    </Link>
                  ) : (
                    <a
                      href="#demo"
                      className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
                      aria-label={plan.cta}
                    >
                      {plan.cta}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-8">
          <p className="text-xs text-slate-500">
            Sandbox AI · Simulateur d&apos;API pour agents IA
          </p>
          <div className="flex gap-6 text-xs">
            <a
              href="/contact"
              aria-label="Nous contacter"
              className="text-slate-500 transition hover:text-slate-300 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Contact
            </a>
            <a
              href="/confidentialite"
              aria-label="Politique de confidentialité"
              className="text-slate-500 transition hover:text-slate-300 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Confidentialité
            </a>
            <a
              href="/cgu"
              aria-label="Conditions générales d'utilisation"
              className="text-slate-500 transition hover:text-slate-300 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Conditions
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
