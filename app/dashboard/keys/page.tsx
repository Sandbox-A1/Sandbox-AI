"use client";

import { useState, useEffect, useCallback } from "react";
import { KeyRound, Copy, Plus, Shield, X } from "lucide-react";

type ApiKeyRecord = {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  last_used_at: string | null;
};

export default function KeysPage() {
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newKeyReveal, setNewKeyReveal] = useState<{ key: string; name: string } | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const fetchKeys = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/keys");
      if (!res.ok) {
        setKeys([]);
        return;
      }
      const json = await res.json();
      setKeys(json.keys ?? []);
    } catch {
      setKeys([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const handleCopy = async (id: string, fullKey: string) => {
    await navigator.clipboard.writeText(fullKey);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateKey = async () => {
    if (creating) return;
    setCreating(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Nouvelle clé" }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.success && data.key && data.record) {
        setNewKeyReveal({ key: data.key, name: data.record.name });
        setKeys((prev) => [
          {
            id: data.record.id,
            name: data.record.name,
            key_prefix: data.record.key_prefix,
            created_at: data.record.created_at,
            last_used_at: null,
          },
          ...prev,
        ]);
      }
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (revokingId) return;
    setRevokingId(id);
    try {
      const res = await fetch(`/api/keys/${id}`, { method: "DELETE" });
      if (res.ok) {
        setKeys((prev) => prev.filter((k) => k.id !== id));
      }
    } finally {
      setRevokingId(null);
    }
  };

  const formatDate = (raw: string) => {
    try {
      return new Date(raw).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return raw;
    }
  };

  const formatLastUsed = (raw: string | null) => {
    if (!raw) return "Jamais";
    try {
      const d = new Date(raw);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      if (diffMs < 60_000) return "À l'instant";
      if (diffMs < 3600_000) return "Il y a " + Math.floor(diffMs / 60_000) + " min";
      if (diffMs < 86400_000) return "Il y a " + Math.floor(diffMs / 3600_000) + " h";
      return formatDate(raw);
    } catch {
      return "—";
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          Clés API
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Gérez les clés utilisées par vos agents pour appeler la sandbox. Ne partagez jamais une clé complète.
        </p>
      </div>

      {newKeyReveal && (
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-emerald-200">Clé créée — copiez-la maintenant</p>
              <p className="mt-2 font-mono text-sm text-slate-300 break-all">{newKeyReveal.key}</p>
              <p className="mt-2 text-xs text-slate-500">Elle ne sera plus affichée après fermeture.</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => handleCopy("new", newKeyReveal.key)}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
              >
                {copiedId === "new" ? "Copié !" : "Copier"}
              </button>
              <button
                type="button"
                onClick={() => setNewKeyReveal(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <section aria-labelledby="keys-list-title">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="keys-list-title" className="text-lg font-bold tracking-tight text-white">
            Vos clés
          </h2>
          <button
            type="button"
            onClick={handleCreateKey}
            disabled={creating}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-50"
            aria-label="Créer une nouvelle clé API"
          >
            <Plus className="h-4 w-4" aria-hidden />
            {creating ? "Création…" : "Créer une clé"}
          </button>
        </div>

        {loading ? (
          <p className="py-8 text-center text-slate-500">Chargement des clés…</p>
        ) : keys.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8 text-center">
            <p className="text-slate-400">Aucune clé pour le moment.</p>
            <p className="mt-1 text-sm text-slate-500">Créez une clé pour que vos agents puissent appeler la sandbox.</p>
            <button
              type="button"
              onClick={handleCreateKey}
              disabled={creating}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> Créer une clé
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {keys.map((key) => (
              <div
                key={key.id}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10">
                      <KeyRound className="h-6 w-6 text-indigo-400" aria-hidden />
                    </div>
                    <div>
                      <p className="font-medium text-white">{key.name}</p>
                      <p className="font-mono text-sm text-slate-400">{key.key_prefix}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Créée le {formatDate(key.created_at)} · Dernière utilisation : {formatLastUsed(key.last_used_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(key.id, key.key_prefix)}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-500"
                      aria-label="Copier le préfixe (la clé complète n’est pas stockée)"
                      title="Seul le préfixe est affiché ; la clé complète n’est plus disponible après création."
                    >
                      <Copy className="h-4 w-4" aria-hidden />
                      {copiedId === key.id ? "Copié !" : "Copier le préfixe"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRevoke(key.id)}
                      disabled={revokingId !== null}
                      className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-400 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50"
                      aria-label="Révoquer la clé"
                    >
                      {revokingId === key.id ? "…" : "Révoquer"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <Shield className="h-5 w-5 shrink-0 text-amber-500" aria-hidden />
          <div className="text-sm text-slate-300">
            <p className="font-medium text-amber-200">Sécurité</p>
            <p className="mt-1 text-slate-400">
              Les clés permettent d&apos;authentifier les requêtes vers la sandbox (header <code className="rounded bg-white/10 px-1">Authorization: Bearer sk_test_xxx</code>). La clé complète n’est affichée qu’une fois à la création. En cas de fuite, révoquez la clé et générez-en une nouvelle.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
