import Link from "next/link";

export const metadata = {
  title: "Confidentialité — Sandbox AI",
  description: "Politique de confidentialité de Sandbox AI.",
};

export default function ConfidentialitePage() {
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
            Retour à l&apos;accueil
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 md:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          Politique de confidentialité
        </h1>
        <p className="mt-2 text-sm text-slate-500">Dernière mise à jour : mars 2025</p>

        <div className="prose prose-invert mt-10 max-w-none prose-p:text-slate-400 prose-headings:text-white prose-strong:text-slate-200">
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-white">1. Données collectées</h2>
            <p>
              Sandbox AI collecte les données nécessaires au fonctionnement du service : identifiant de compte (via Clerk), logs d&apos;appels API (heure, action, statut) et clés API que vous générez. Nous ne vendons pas vos données à des tiers.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-white">2. Utilisation</h2>
            <p>
              Les données sont utilisées pour fournir la sandbox (simulation d&apos;API), afficher l&apos;historique des logs dans votre dashboard et assurer la sécurité du service (authentification, isolation des données par utilisateur).
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-white">3. Hébergement et sous-traitants</h2>
            <p>
              Les données sont hébergées chez des prestataires (Clerk pour l&apos;authentification, Supabase pour les logs, Vercel pour l&apos;application). Ils sont choisis pour leur conformité et la localisation des données en zone appropriée.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-white">4. Vos droits</h2>
            <p>
              Vous pouvez demander l&apos;accès, la rectification ou la suppression de vos données en nous contactant. Pour la gestion du compte (email, mot de passe), utilisez les paramètres de votre compte Clerk.
            </p>
          </section>
        </div>

        <p className="mt-12 text-sm text-slate-500">
          <Link href="/" className="text-indigo-400 hover:underline">
            Retour à l&apos;accueil
          </Link>
        </p>
      </main>
    </div>
  );
}
