"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardDocsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/guide");
  }, [router]);

  return (
    <div className="flex min-h-[200px] items-center justify-center text-slate-400">
      <p className="text-sm">Redirection vers le Guide API…</p>
    </div>
  );
}
