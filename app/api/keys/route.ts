import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";
import { hashApiKey } from "@/lib/auth-api";

const GENERIC_ERROR = "Une erreur est survenue. Réessayez plus tard.";

function generateApiKey(): { full: string; prefix: string; hash: string } {
  const suffix = randomBytes(12).toString("base64url").replace(/[-_]/g, "").slice(0, 24);
  const full = `sk_test_${suffix}`;
  const prefix = `sk_test_••••••••••••${full.slice(-4)}`;
  return { full, prefix, hash: hashApiKey(full) };
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from("api_keys")
    .select("id, name, key_prefix, created_at, last_used_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET /api/keys:", error);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }

  return NextResponse.json({ success: true, keys: data ?? [] });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  let body: { name?: string } = {};
  try {
    body = (await req.json().catch(() => ({}))) as { name?: string };
  } catch {
    // leave body empty
  }
  const name = typeof body.name === "string" && body.name.trim() ? body.name.trim().slice(0, 100) : "Nouvelle clé";

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }

  const { full, prefix, hash } = generateApiKey();
  const supabase = createClient(url, serviceKey);

  const { data: row, error } = await supabase
    .from("api_keys")
    .insert([{ user_id: userId, name, key_prefix: prefix, key_hash: hash }])
    .select("id, name, key_prefix, created_at")
    .single();

  if (error) {
    console.error("POST /api/keys:", error);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    key: full,
    keyOnce: true,
    record: row,
  });
}
