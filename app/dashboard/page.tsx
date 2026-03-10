"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Copy, Key, KeyRound, BarChart3 } from "lucide-react";

type LogEntry = {
  id: string;
  time: string;
  agent: string;
  action: string;
  statusDisplay: string;
  isSuccess: boolean;
};

const SCENARIO_LABELS: Record<string, string> = {
  success: "✅ Succès",
  error_500: "🌪️ Erreur Serveur (500)",
  latency_5s: "🐢 Latence (5s)",
  rate_limit_429: "🚦 Rate Limit (429)",
  card_declined_402: "💳 Carte Refusée (402)",
};

function trackEvent(eventName: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const plausible = (window as any).plausible as
    | ((event: string, options?: { props?: Record<string, unknown> }) => void)
    | undefined;
  if (!plausible) return;
  plausible(eventName, props ? { props } : undefined);
}

function isSuccessStatus(status: string): boolean {
  const normalized = status.toLowerCase();
  return (
    status.startsWith("200") ||
    normalized.includes("succès") ||
    normalized.includes("success")
  );
}

export default function DashboardPage() {
  const { isLoaded } = useAuth();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [usage, setUsage] = useState<{ count: number; limit: number } | null>(null);
  const [firstKey, setFirstKey] = useState<{ key_prefix: string; name: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [scenario, setScenario] = useState("success");
  const [isSimulating, setIsSimulating] = useState(false);
  const [status, setStatus] = useState("");

  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const res = await fetch("/api/logs");
      if (!res.ok) {
        setLogs([]);
        return;
      }
      const json = await res.json();
      const data = Array.isArray(json) ? json : (json.logs || []);
      setLogs(
        data.map((row: { id: string; action?: string; status?: string; agent?: string; created_at?: string }) => ({
          id: row.id || crypto.randomUUID(),
          time: row.created_at
            ? new Date(row.created_at).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : "—",
          agent: row.agent ?? "—",
          action: row.action ?? "—",
          statusDisplay: row.status ?? "—",
          isSuccess: row.status ? isSuccessStatus(row.status) : false,
        }))
      );
    } catch {
      setLogs([]);
    } finally {
      setLogsLoading(false);
    }
  }, []);

  const fetchUsage = useCallback(async () => {
    try {
      const res = await fetch("/api/usage");
      if (res.ok) {
        const json = await res.json();
        if (json.success && typeof json.count === "number" && typeof json.limit === "number") {
          setUsage({ count: json.count, limit: json.limit });
        }
      }
    } catch {
      setUsage(null);
    }
  }, []);

  const fetchKeys = useCallback(async () => {
    try {
      const res = await fetch("/api/keys");
      if (res.ok) {
        const json = await res.json();
        const keys = json.keys ?? [];
        if (keys.length > 0) {
          setFirstKey({ key_prefix: keys[0].key_prefix, name: keys[0].name });
        } else {
          setFirstKey(null);
        }
      }
    } catch {
      setFirstKey(null);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    fetchLogs();
    fetchUsage();
    fetchKeys();
  }, [isLoaded, fetchLogs, fetchUsage, fetchKeys]);

  const handleCopy = async () => {
    if (firstKey?.key_prefix) {
      await navigator.clipboard.writeText(firstKey.key_prefix);
    } else {
      await navigator.clipboard.writeText("sk_test_…");
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    const scenarioLabel = SCENARIO_LABELS[scenario] ?? scenario;
    setStatus(`⏳ ${scenarioLabel} — simulation en cours...`);
    trackEvent("demo_stripe_run", { scenario });
    try {
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario }),
      });
      const data = (await response.json().catch(() => ({}))) as { success?: boolean; error?: string };
      if (response.ok && data.success) {
        setStatus(`${scenarioLabel} — log enregistré ✅`);
        trackEvent("demo_stripe_success", { scenario });
      } else {
        setStatus(`${scenarioLabel} — ❌ KO : ${data.error || "ÉCHEC"}`);
        trackEvent("demo_stripe_error", { scenario, error: data.error || "unknown" });
      }
      await fetchLogs();
    } catch {
      const scenarioLabelCatch = SCENARIO_LABELS[scenario] ?? scenario;
      setStatus(`${scenarioLabelCatch} — ❌ KO : ÉCHEC`);
      trackEvent("demo_stripe_error", { scenario, error: "network" });
      await fetchLogs();
    } finally {
      setIsSimulating(false);
    }
  };

  const handleCryptoPayment = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    const scenarioLabel = SCENARIO_LABELS[scenario] ?? scenario;
    setStatus(`⏳ ${scenarioLabel} — simulation crypto en cours...`);
    trackEvent("demo_crypto_run", { scenario });
    try {
      const response = await fetch("/api/crypto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
        tx_hash?: string;
      };
      if (response.ok && data.success) {
        setStatus(
          `🪙 SUCCÈS : TX CRYPTO VALIDÉE ! ${data.tx_hash ? `(${data.tx_hash})` : ""}`.trim()
        );
        trackEvent("demo_crypto_success", { scenario });
      } else {
        setStatus(`🪙 CRYPTO — ❌ KO : ${data.error || "ÉCHEC"}`);
        trackEvent("demo_crypto_error", { scenario, error: data.error || "unknown" });
      }
      await fetchLogs();
    } catch {
      setStatus("🪙 CRYPTO — ❌ KO : ÉCHEC");
      trackEvent("demo_crypto_error", { scenario, error: "network" });
      await fetchLogs();
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    if (status.includes("SUCCESS")) fetchUsage();
  }, [status, fetchUsage]);

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Vue d&apos;ensemble
          </h1>
          <p className="max-w-md text-sm text-slate-400">
            Choisissez un scénario, lancez une simulation Stripe ou Crypto, puis
            inspectez les logs générés par vos agents IA.
          </p>
          <label className="flex flex-col gap-1 text-sm text-slate-400">
            <span className="font-medium text-slate-200">Scénario</span>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="h-9 rounded-md border border-white/10 bg-[#111]/80 px-3 text-sm text-slate-100 shadow-sm outline-none transition hover:border-white/20 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/60"
              aria-label="Choisir le scénario de simulation"
            >
              <option value="success">✅ Succès</option>
              <option value="error_500">🌪️ Erreur Serveur (500)</option>
              <option value="latency_5s">🐢 Latence (5s)</option>
              <option value="rate_limit_429">🚦 Rate Limit (429)</option>
              <option value="card_declined_402">💳 Carte Refusée (402)</option>
            </select>
            <span className="text-xs text-slate-500">
              C&apos;est le comportement que l&apos;API va simuler pour vos appels.
            </span>
          </label>
        </div>
      </div>

      {usage !== null && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
          <BarChart3 className="h-5 w-5 shrink-0 text-indigo-400" aria-hidden />
          <span className="text-sm text-slate-400">
            Requêtes ce mois :{" "}
            <span className={usage.count >= usage.limit ? "font-medium text-amber-400" : "text-white"}>
              {usage.count} / {usage.limit}
            </span>
          </span>
          {usage.count >= usage.limit && (
            <span className="ml-auto text-xs text-amber-400">Quota Sandbox atteint</span>
          )}
        </div>
      )}

          {/* Section Vos Clés API */}
          <section
            className="mb-8"
            aria-labelledby="api-keys-title"
          >
            <h2
              id="api-keys-title"
              className="mb-4 text-lg font-bold tracking-tight text-white"
            >
              Vos Clés API
            </h2>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
                    <KeyRound className="h-5 w-5 text-indigo-400" aria-hidden />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      {firstKey ? firstKey.name : "Clé API"}
                    </p>
                    <p className="font-mono text-sm text-slate-200">
                      {firstKey ? firstKey.key_prefix : "Aucune clé — créez-en une dans Clés API"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {firstKey ? (
                    <>
                      <button
                        type="button"
                        onClick={handleCopy}
                        aria-label="Copier le préfixe de la clé API"
                        className="inline-flex items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
                      >
                        <Copy className="h-4 w-4 shrink-0" aria-hidden />
                        {copied ? "Copié !" : "Copier le préfixe"}
                      </button>
                      <Link
                        href="/dashboard/keys"
                        aria-label="Gérer les clés API"
                        className="inline-flex items-center justify-center gap-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
                      >
                        <Key className="h-4 w-4 shrink-0" aria-hidden />
                        Gérer les clés
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/dashboard/keys"
                      aria-label="Créer une clé API"
                      className="inline-flex items-center justify-center gap-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
                    >
                      <Key className="h-4 w-4 shrink-0" aria-hidden />
                      Créer une clé API
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Section Activité Récente */}
          <section
            aria-labelledby="activity-title"
          >
            <h2
              id="activity-title"
              className="mb-4 text-lg font-bold tracking-tight text-white"
            >
              Activité Récente
            </h2>
            <div className="mb-4 flex flex-col items-end gap-2">
              <div className="flex flex-wrap justify-end gap-4">
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  disabled={isSimulating || (usage !== null && usage.count >= usage.limit)}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-md transition hover:bg-indigo-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Simuler un paiement"
                >
                  Simuler un paiement
                  {isSimulating && (
                    <span className="h-2 w-2 animate-pulse rounded-full bg-white" aria-hidden />
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCryptoPayment}
                  disabled={isSimulating || (usage !== null && usage.count >= usage.limit)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-indigo-500/60 bg-transparent px-5 py-3 text-sm font-medium text-indigo-300 transition hover:border-indigo-400 hover:bg-indigo-500/10 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Simuler un paiement crypto USDC"
                >
                  🪙 Simuler Paiement Crypto (USDC)
                </button>
              </div>
              {status && (
                <p
                  className={
                    status.includes("CRYPTO")
                      ? "mt-2 text-[10px] font-bold uppercase tracking-widest text-indigo-300 animate-pulse"
                      : status.includes("ERREUR") || status.includes("KO")
                      ? "mt-2 text-[10px] font-bold uppercase tracking-widest text-amber-500 animate-pulse"
                      : "mt-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400 animate-pulse"
                  }
                >
                  {status}
                </p>
              )}
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-800/50 shadow-xl backdrop-blur-sm">
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
                        Action
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {logsLoading ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                          Chargement des logs…
                        </td>
                      </tr>
                    ) : logs.length === 0 ? (
                      <tr>
                        <td className="px-4 py-6 text-slate-500">—</td>
                        <td className="px-4 py-6 text-slate-500">—</td>
                        <td className="px-4 py-6 text-slate-500">
                          Aucune activité récente — lancez une simulation
                          ci-dessus pour générer vos premiers logs.
                        </td>
                        <td className="px-4 py-6">
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
                              className={`inline-flex max-w-[220px] rounded px-2 py-0.5 font-medium ${
                                log.isSuccess
                                  ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
                                  : "bg-red-500/15 text-red-400 ring-1 ring-red-500/30"
                              }`}
                              role="status"
                              aria-label={log.statusDisplay}
                            >
                              {log.statusDisplay}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
      </>
  );
}
