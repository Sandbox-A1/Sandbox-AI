import Link from "next/link";

export const metadata = {
  title: "Conditions d'utilisation — Sandbox AI",
  description: "Conditions générales d'utilisation de Sandbox AI.",
};

export default function CGUPage() {
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
          Conditions générales d&apos;utilisation
        </h1>
        <p className="mt-2 text-sm text-slate-500">Dernière mise à jour : mars 2025</p>

        <div className="prose prose-invert mt-10 max-w-none prose-p:text-slate-400 prose-headings:text-white prose-strong:text-slate-200">
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-white">1. Objet</h2>
            <p>
              Les présentes conditions régissent l&apos;utilisation du service Sandbox AI, simulateur d&apos;API destiné aux développeurs et agents IA pour tester des intégrations sans appel aux services réels.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-white">2. Acceptation</h2>
            <p>
              L&apos;accès au dashboard et à l&apos;API sandbox vaut acceptation des présentes CGU. En cas de désaccord, il convient de ne pas utiliser le service.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-white">3. Usage acceptable</h2>
            <p>
              Vous vous engagez à utiliser Sandbox AI à des fins de test et de développement. L&apos;usage pour contourner des systèmes de sécurité, envoyer du contenu illicite ou surcharger volontairement le service est interdit.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-white">4. Disponibilité et limites</h2>
            <p>
              Le service est fourni &quot;en l&apos;état&quot;. Les quotas (requêtes, rétention des logs) dépendent du plan souscrit. Sandbox AI s&apos;efforce d&apos;assurer une disponibilité raisonnable mais ne garantit pas un taux de disponibilité minimal.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-white">5. Contact</h2>
            <p>
              Pour toute question relative aux présentes conditions : utilisez les moyens de contact indiqués sur le site.
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
