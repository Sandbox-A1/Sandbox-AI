"use client";

import { useUser } from "@clerk/nextjs";
import { User, Mail, Shield } from "lucide-react";

export default function SettingsPage() {
  const { user } = useUser();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          Paramètres
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Gérez votre compte et vos préférences.
        </p>
      </div>

      <div className="space-y-6">
        <section
          className="rounded-xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md"
          aria-labelledby="profile-title"
        >
          <h2 id="profile-title" className="mb-4 flex items-center gap-2 text-lg font-bold tracking-tight text-white">
            <User className="h-5 w-5 text-indigo-400" aria-hidden />
            Profil
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500">Nom</dt>
              <dd className="mt-1 text-slate-200">
                {user?.fullName ?? user?.firstName ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500">Identifiant</dt>
              <dd className="mt-1 font-mono text-sm text-slate-400">
                {user?.id ?? "—"}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-slate-500">
            Pour modifier votre nom ou votre photo, utilisez le menu du profil (icône en haut à droite).
          </p>
        </section>

        <section
          className="rounded-xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md"
          aria-labelledby="email-title"
        >
          <h2 id="email-title" className="mb-4 flex items-center gap-2 text-lg font-bold tracking-tight text-white">
            <Mail className="h-5 w-5 text-indigo-400" aria-hidden />
            Email
          </h2>
          <p className="text-slate-300">
            {user?.primaryEmailAddress?.emailAddress ?? "Non renseigné"}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Géré par Clerk. Modifiez depuis le portail utilisateur Clerk ou le menu profil.
          </p>
        </section>

        <section
          className="rounded-xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md"
          aria-labelledby="security-title"
        >
          <h2 id="security-title" className="mb-4 flex items-center gap-2 text-lg font-bold tracking-tight text-white">
            <Shield className="h-5 w-5 text-indigo-400" aria-hidden />
            Sécurité
          </h2>
          <p className="text-sm text-slate-400">
            Mot de passe et authentification à deux facteurs : gérez-les depuis le menu profil (compte Clerk).
          </p>
        </section>
      </div>
    </>
  );
}
