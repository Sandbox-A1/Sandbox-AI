"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Send, ArrowLeft } from "lucide-react";

function ContactForm() {
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const subject = searchParams.get("subject");
    if (subject) {
      const decoded = decodeURIComponent(subject);
      setMessage((prev) => (prev ? prev : `Sujet : ${decoded}\n\n`));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setSent(true);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setError((data.error as string) || "Erreur lors de l'envoi.");
      }
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setSending(false);
    }
  };

  return sent ? (
    <div className="mt-10 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6">
      <p className="font-medium text-emerald-200">Message envoyé</p>
      <p className="mt-2 text-sm text-slate-400">
        Nous vous répondrons à l&apos;adresse indiquée dès que possible.
      </p>
      <button
        type="button"
        onClick={() => setSent(false)}
        className="mt-4 text-sm text-indigo-400 hover:underline"
      >
        Envoyer un autre message
      </button>
    </div>
  ) : (
    <>
      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
      {searchParams.get("subject") && (
        <p className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-200">
          Sujet de votre demande : {decodeURIComponent(searchParams.get("subject") ?? "")}
        </p>
      )}
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-slate-300">Nom</label>
        <input
          id="contact-name"
          type="text"
          required
          maxLength={200}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Votre nom"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-slate-300">Email</label>
        <input
          id="contact-email"
          type="email"
          required
          maxLength={320}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="vous@exemple.com"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-slate-300">Message</label>
        <textarea
          id="contact-message"
          required
          rows={5}
          maxLength={5000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Votre message..."
        />
      </div>
      {error && (
        <p className="text-sm text-amber-400" role="alert">{error}</p>
      )}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-50"
        >
          <Send className="h-4 w-4" aria-hidden />
          {sending ? "Envoi…" : "Envoyer"}
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Retour
        </Link>
      </div>
      </form>
    </>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans text-slate-300 antialiased">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 md:px-8">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Sandbox AI
          </Link>
          <Link
            href="/"
            className="text-sm text-slate-400 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
          >
            Retour
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 py-16 md:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          Contact
        </h1>
        <p className="mt-2 text-slate-400">
          Une question, un partenariat ou un support ? Envoyez-nous un message.
        </p>

        <Suspense fallback={<div className="mt-10 h-40 animate-pulse rounded-xl bg-white/5" />}>
          <ContactForm />
        </Suspense>
      </main>
    </div>
  );
}
