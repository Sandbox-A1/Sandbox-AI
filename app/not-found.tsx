import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] px-4 font-sans text-slate-300 antialiased">
      <p className="text-6xl font-bold text-white">404</p>
      <h1 className="mt-4 text-xl font-semibold text-white">Page introuvable</h1>
      <p className="mt-2 max-w-sm text-center text-sm text-slate-400">
        La page que vous recherchez n’existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-400"
      >
        Retour à l’accueil
      </Link>
    </div>
  );
}
