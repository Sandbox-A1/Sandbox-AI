"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { Download, RefreshCw } from "lucide-react";

type LogEntry = {
  id: string;
  time: string;
  date: string;
  agent: string;
  action: string;
  statusDisplay: string;
  isSuccess: boolean;
};

function isSuccessStatus(status: string): boolean {
  return status.startsWith("200") || status.toLowerCase().includes("succès");
}

export default function LogsPage() {
  const { isLoaded } = useAuth();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
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
          date: row.created_at
            ? new Date(row.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
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
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    fetchLogs();
  }, [isLoaded, fetchLogs]);

  const handleExport = () => {
    const headers = ["Date", "Heure", "Agent", "Action", "Statut"];
    const rows = logs.map((l) => [l.date, l.time, l.agent, l.action, l.statusDisplay]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sandbox-ai-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Logs des Agents
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Historique des appels API simulés par vos agents.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={fetchLogs}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50"
            aria-label="Rafraîchir les logs"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden />
            Rafraîchir
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={logs.length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-50"
            aria-label="Exporter en CSV"
          >
            <Download className="h-4 w-4" aria-hidden />
            Exporter CSV
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#333] bg-[#111] shadow-xl">
        <div className="overflow-x-auto font-mono text-sm">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-[#333]">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Date
                </th>
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
            <tbody className="divide-y divide-[#333]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                    Chargement des logs…
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                    Aucun log pour le moment. Les appels à la sandbox apparaîtront ici.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="transition hover:bg-white/[0.03]">
                    <td className="px-4 py-3 text-slate-400">{log.date}</td>
                    <td className="px-4 py-3 text-slate-400">{log.time}</td>
                    <td className="px-4 py-3 text-slate-300">{log.agent}</td>
                    <td className="px-4 py-3 text-slate-400">{log.action}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex max-w-[220px] rounded px-2 py-0.5 font-medium ${
                          log.isSuccess
                            ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
                            : "bg-red-500/15 text-red-400 ring-1 ring-red-500/30"
                        }`}
                        role="status"
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
    </>
  );
}
