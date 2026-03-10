"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Code, Key, Zap, AlertTriangle, Rocket, FileCode } from "lucide-react";

const BASE_URL_PLACEHOLDER = "https://votre-domaine.com";

export default function GuidePage() {
  const [baseUrl, setBaseUrl] = useState(BASE_URL_PLACEHOLDER);

  useEffect(() => {
    setBaseUrl(typeof window !== "undefined" ? window.location.origin : BASE_URL_PLACEHOLDER);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans text-slate-300 antialiased">
      <header className="border-b border-white/5 bg-[#0A0A0A]">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            aria-label="Retour à l'accueil Sandbox AI"
          >
            Sandbox AI
          </Link>
          <nav className="flex items-center gap-6" aria-label="Navigation">
            <Link href="/#demo" className="text-sm text-slate-400 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
              Démo
            </Link>
            <Link href="/#pricing" className="text-sm text-slate-400 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
              Tarifs
            </Link>
            <Link href="/dashboard" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]" aria-label="Ouvrir le dashboard">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 md:px-8">
        {/* Bandeau hero Guide API */}
        <section className="relative overflow-hidden rounded-b-2xl border border-white/10 border-t-0 bg-gradient-to-b from-indigo-500/10 via-slate-900/50 to-transparent px-6 pb-12 pt-10 md:px-10 md:pb-14 md:pt-12">
          <div className="relative">
            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-indigo-400">Référence</p>
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Guide API
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-300">
              Intégrez la sandbox dans vos agents IA : base URL, authentification, endpoints et bonnes pratiques.
            </p>
            <nav className="mt-8 flex flex-wrap gap-3" aria-label="Sections du guide">
              <a href="#quickstart-title" className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-indigo-500/20 hover:text-white">Démarrage</a>
              <a href="#base-url-title" className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-indigo-500/20 hover:text-white">Base URL</a>
              <a href="#auth-title" className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-indigo-500/20 hover:text-white">Authentification</a>
              <a href="#stripe-title" className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-indigo-500/20 hover:text-white">Paiement Stripe</a>
              <a href="#crypto-title" className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-indigo-500/20 hover:text-white">Paiement Crypto</a>
              <a href="#logs-title" className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-indigo-500/20 hover:text-white">Logs</a>
            </nav>
          </div>
        </section>

        <div className="space-y-14 py-12 md:py-16">
          <section aria-labelledby="quickstart-title">
            <h2 id="quickstart-title" className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
              <Rocket className="h-5 w-5 text-indigo-400" aria-hidden />
              Démarrage rapide
            </h2>
            <p className="mb-4 text-slate-400">
              Sandbox AI expose une API REST pour simuler des paiements (Stripe) et autres appels sans toucher à la production. Créez une clé API depuis le{" "}
              <Link href="/dashboard/keys" className="text-indigo-400 underline hover:no-underline">dashboard</Link>, puis appelez les endpoints avec le header <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm">Authorization: Bearer &lt;votre_clé&gt;</code>.
            </p>
            <ul className="list-inside list-disc space-y-2 text-sm text-slate-400">
              <li>Plan Sandbox : 500 requêtes/mois, 1 API (Stripe), logs 24h</li>
              <li>Plan Pro : 50 000 requêtes/mois, Chaos activé, logs 30 jours</li>
              <li>Toutes les réponses sont simulées ; aucun paiement réel n’est effectué.</li>
            </ul>
          </section>

          <section aria-labelledby="tutorial-title">
            <h2 id="tutorial-title" className="mb-4 text-xl font-bold text-white">
              Tutoriel rapide (5 étapes)
            </h2>
            <ol className="list-inside list-decimal space-y-3 text-sm text-slate-400">
              <li>
                <span className="font-medium text-slate-200">Créer un compte et une clé API.</span>{" "}
                Connectez-vous à Sandbox AI puis allez dans{" "}
                <Link href="/dashboard/keys" className="text-indigo-400 underline hover:no-underline">
                  Dashboard &gt; Clés API
                </Link>{" "}
                pour générer votre première clé.
              </li>
              <li>
                <span className="font-medium text-slate-200">Choisir un scénario.</span>{" "}
                Dans le dashboard, utilisez le sélecteur <span className="font-mono">Scénario</span> pour décider
                si l&apos;API doit répondre en succès, erreur 500, latence, rate limit, etc.
              </li>
              <li>
                <span className="font-medium text-slate-200">Lancer une simulation Stripe ou Crypto.</span>{" "}
                Cliquez sur <span className="font-mono">Simuler un paiement</span> (Stripe) ou{" "}
                <span className="font-mono">Simuler Paiement Crypto (USDC)</span>. Le statut au-dessus des boutons
                vous indique immédiatement le résultat.
              </li>
              <li>
                <span className="font-medium text-slate-200">Brancher votre agent ou script.</span>{" "}
                Reprenez les exemples cURL Stripe / Crypto ci-dessous pour appeler la sandbox depuis un agent IA,
                un test end-to-end ou un script serveur.
              </li>
              <li>
                <span className="font-medium text-slate-200">Analyser les logs.</span>{" "}
                Consultez la section <span className="font-mono">Activité récente</span> du dashboard ou appelez{" "}
                <span className="font-mono">GET /api/logs</span> pour voir comment votre agent se comporte selon les
                scénarios choisis et ajuster vos prompts en conséquence.
              </li>
            </ol>
          </section>

          <section aria-labelledby="base-url-title">
            <h2 id="base-url-title" className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
              <Code className="h-5 w-5 text-indigo-400" aria-hidden />
              Base URL
            </h2>
            <p className="mb-4 text-slate-400">
              Toutes les routes sont relatives à l’origine de votre déploiement. En local ou après déploiement, utilisez :
            </p>
            <div className="rounded-xl border border-white/10 bg-slate-800/50 p-4 font-mono text-sm text-slate-300">
              <code className="text-indigo-400">{baseUrl}</code>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Remplacez par votre URL de production (ex. https://api.votre-saas.com) lorsque vous basculez hors sandbox.
            </p>
          </section>

          <section aria-labelledby="auth-title">
            <h2 id="auth-title" className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
              <Key className="h-5 w-5 text-indigo-400" aria-hidden />
              Authentification
            </h2>
            <p className="mb-4 text-slate-400">
              Les routes sont protégées par session (cookies) ou par <strong className="text-slate-300">clé API</strong>. Pour les agents et scripts, générez une clé dans{" "}
              <Link href="/dashboard/keys" className="text-indigo-400 underline hover:no-underline">Clés API</Link> et envoyez-la dans chaque requête :
            </p>
            <pre className="overflow-x-auto rounded-xl border border-white/10 bg-slate-800/50 p-4 font-mono text-sm text-slate-300">
{`Authorization: Bearer sk_test_xxxx...
Content-Type: application/json`}
            </pre>
            <p className="mt-2 text-xs text-slate-500">
              Depuis le navigateur (dashboard), les cookies de session suffisent ; pas besoin de clé dans l’en-tête.
            </p>
          </section>

          <section aria-labelledby="stripe-title">
            <h2 id="stripe-title" className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
              <Zap className="h-5 w-5 text-indigo-400" aria-hidden />
              Simuler un paiement (Stripe)
            </h2>
            <p className="mb-2 text-slate-400">
              <strong className="text-white">POST</strong> <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm">/api/stripe</code>
            </p>
            <p className="mb-4 text-sm text-slate-400">
              Envoie une requête simulée type paiement. Option <code className="rounded bg-white/10 px-1 py-0.5 font-mono">chaos_mode: true</code> pour forcer une erreur 500 (test de résilience).
            </p>
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Exemple cURL</p>
                <pre className="overflow-x-auto rounded-xl border border-white/10 bg-slate-800/50 p-4 font-mono text-sm text-slate-300">
{`curl -X POST "${baseUrl}/api/stripe" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_test_xxx" \\
  -d '{"chaos_mode": false}'`}
                </pre>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Corps (JSON)</p>
                <pre className="overflow-x-auto rounded-xl border border-white/10 bg-slate-800/50 p-4 font-mono text-sm text-slate-300">
{`{
  "chaos_mode": false   // true = erreur 500 simulée (résilience)
}`}
                </pre>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Réponse 200</p>
                <pre className="overflow-x-auto rounded-xl border border-white/10 bg-slate-800/50 p-4 font-mono text-sm text-slate-300">
{`{
  "success": true,
  "data": [{ "id": "...", "user_id": "...", "status": "success", ... }]
}`}
                </pre>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Erreur 401 / 500</p>
                <pre className="overflow-x-auto rounded-xl border border-white/10 bg-slate-800/50 p-4 font-mono text-sm text-slate-300">
{`{
  "success": false,
  "error": "Message d'erreur"
}`}
                </pre>
              </div>
            </div>
          </section>

          <section aria-labelledby="crypto-title">
            <h2 id="crypto-title" className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
              <Zap className="h-5 w-5 text-indigo-400" aria-hidden />
              Simuler un paiement Crypto (USDC)
            </h2>
            <p className="mb-2 text-slate-400">
              <strong className="text-white">POST</strong>{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm">/api/crypto</code>
            </p>
            <p className="mb-4 text-sm text-slate-400">
              Permet de simuler une transaction USDC sur la blockchain. Le comportement est piloté par le champ{" "}
              <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs">scenario</code> (succès, erreur 500, latence, rate limit, carte refusée).
            </p>
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Exemple cURL</p>
                <pre className="overflow-x-auto rounded-xl border border-white/10 bg-slate-800/50 p-4 font-mono text-sm text-slate-300">
{`curl -X POST "${baseUrl}/api/crypto" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_test_xxx" \\
  -d '{ "scenario": "success" }'`}
                </pre>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Corps (JSON)</p>
                <pre className="overflow-x-auto rounded-xl border border-white/10 bg-slate-800/50 p-4 font-mono text-sm text-slate-300">
{`{
  "scenario": "success"        // ou "error_500", "latency_5s",
                               // "rate_limit_429", "card_declined_402"
}`}
                </pre>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Réponse 200</p>
                <pre className="overflow-x-auto rounded-xl border border-white/10 bg-slate-800/50 p-4 font-mono text-sm text-slate-300">
{`{
  "success": true,
  "message": "Transaction validée sur la blockchain",
  "tx_hash": "0x..."
}`}
                </pre>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Erreurs possibles</p>
                <pre className="overflow-x-auto rounded-xl border border-white/10 bg-slate-800/50 p-4 font-mono text-sm text-slate-300">
{`// 500 — Erreur serveur simulée
{
  "success": false,
  "error": "500 : Erreur serveur simulée 🌪️"
}

// 402 — Carte refusée
{
  "success": false,
  "error": "402 : Carte refusée 💳"
}

// 429 — Limite de requêtes simulée
{
  "success": false,
  "error": "429 : Limite de requêtes simulée 🚦"
}`}
                </pre>
              </div>
            </div>
          </section>

          <section aria-labelledby="logs-title">
            <h2 id="logs-title" className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
              <FileCode className="h-5 w-5 text-indigo-400" aria-hidden />
              Récupérer les logs
            </h2>
            <p className="mb-2 text-slate-400">
              <strong className="text-white">GET</strong> <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm">/api/logs</code>
            </p>
            <p className="mb-4 text-sm text-slate-400">
              Retourne les derniers logs associés à votre compte (ou à la clé API utilisée). Idéal pour débugger et vérifier les appels.
            </p>
            <pre className="overflow-x-auto rounded-xl border border-white/10 bg-slate-800/50 p-4 font-mono text-sm text-slate-300">
{`curl "${baseUrl}/api/logs" \\
  -H "Authorization: Bearer sk_test_xxx"`}
            </pre>
          </section>

          <section aria-labelledby="usage-title">
            <h2 id="usage-title" className="mb-4 text-xl font-bold text-white">
              Quotas et usage
            </h2>
            <p className="mb-4 text-slate-400">
              L’endpoint <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm">/api/usage</code> renvoie le nombre de requêtes consommées et la limite du plan. Utilisez-le pour afficher l’usage dans votre dashboard ou pour adapter le comportement de votre agent.
            </p>
            <pre className="overflow-x-auto rounded-xl border border-white/10 bg-slate-800/50 p-4 font-mono text-sm text-slate-300">
{`curl "${baseUrl}/api/usage" -H "Authorization: Bearer sk_test_xxx"`}
            </pre>
          </section>

          <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" aria-hidden />
            <div className="text-sm text-slate-300">
              <p className="font-medium text-amber-200">Environnement de test</p>
              <p className="mt-1 text-slate-400">
                Cette API est une <strong>simulation</strong>. Aucun paiement réel ni donnée bancaire n’est traité. Utilisez-la pour valider le comportement de vos agents avant la production.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-8">
          <p className="text-xs text-slate-500">Sandbox AI · Guide API</p>
          <div className="flex gap-6 text-xs">
            <Link href="/" className="text-slate-500 transition hover:text-slate-300 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-500">Accueil</Link>
            <Link href="/contact" className="text-slate-500 transition hover:text-slate-300 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-500">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
