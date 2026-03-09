import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const GENERIC_ERROR = "Une erreur est survenue. Réessayez plus tard.";

function validate(body: unknown): { name: string; email: string; message: string } | null {
  if (body === null || typeof body !== "object" || Array.isArray(body)) return null;
  const b = body as Record<string, unknown>;
  const name = typeof b.name === "string" ? b.name.trim().slice(0, 200) : "";
  const email = typeof b.email === "string" ? b.email.trim().slice(0, 320) : "";
  const message = typeof b.message === "string" ? b.message.trim().slice(0, 5000) : "";
  if (!name || !email || !message) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return { name, email, message };
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json().catch(() => null);
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const parsed = validate(body);
  if (!parsed) {
    return NextResponse.json(
      { error: "Vérifiez votre nom, email et message." },
      { status: 400 }
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }

  const supabase = createClient(url, key);
  const { error } = await supabase.from("contact_requests").insert([
    {
      name: parsed.name,
      email: parsed.email,
      message: parsed.message,
    },
  ]);

  if (error) {
    console.error("POST /api/contact:", error);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
