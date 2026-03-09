import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getUserIdFromRequest } from "@/lib/auth-api";

const GENERIC_ERROR_MESSAGE = "Une erreur est survenue. Réessayez plus tard.";
const SANDBOX_LIMIT = 500;

function parseBody(raw: unknown): { scenario: string; chaos_mode: boolean } {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    return { scenario: "success", chaos_mode: false };
  }
  const body = raw as Record<string, unknown>;
  return {
    scenario: typeof body.scenario === "string" ? body.scenario : "success",
    chaos_mode: body.chaos_mode === true,
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    const raw = await req.json().catch(() => null);
    const { scenario, chaos_mode } = parseBody(raw);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      console.error("SUPABASE: URL ou SERVICE_ROLE_KEY manquants dans .env.local");
      return NextResponse.json(
        { success: false, error: GENERIC_ERROR_MESSAGE },
        { status: 500 }
      );
    }
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Scénario dédié rate limit (toujours 429, hors quota mensuel)
    if (scenario === "rate_limit_429") {
      await supabase.from("api_logs").insert([
        {
          user_id: userId,
          status: "429 : Limite de requêtes simulée 🚦",
          action: "CRYPTO_TX_USDC",
          agent: "Agent IA",
        },
      ]);
      return NextResponse.json(
        { success: false, error: "429 : Limite de requêtes simulée 🚦" },
        { status: 429 }
      );
    }

    // Quota mensuel réel (s'applique à tous les autres scénarios)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const { count } = await supabase
      .from("api_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", startOfMonth.toISOString())
      .lte("created_at", endOfMonth.toISOString());
    if ((count ?? 0) >= SANDBOX_LIMIT) {
      return NextResponse.json(
        { success: false, error: "Quota mensuel atteint (500 requêtes). Passez au plan Pro pour plus." },
        { status: 429 }
      );
    }

    // Compatibilité : ancien mode chaos ou scénario explicite error_500
    if (chaos_mode || scenario === "error_500") {
      await supabase.from("api_logs").insert([
        {
          user_id: userId,
          status: "500 : Erreur serveur simulée 🌪️",
          action: "CRYPTO_TX_USDC",
          agent: "Agent IA",
        },
      ]);
      return NextResponse.json(
        { success: false, error: "500 : Erreur serveur simulée 🌪️" },
        { status: 500 }
      );
    }

    // Scénario carte refusée
    if (scenario === "card_declined_402") {
      await supabase.from("api_logs").insert([
        {
          user_id: userId,
          status: "402 : Carte refusée 💳",
          action: "CRYPTO_TX_USDC",
          agent: "Agent IA",
        },
      ]);
      return NextResponse.json(
        { success: false, error: "402 : Carte refusée 💳" },
        { status: 402 }
      );
    }

    // Scénario latence 5s : on retarde avant de logger un succès
    if (scenario === "latency_5s") {
      await sleep(5000);
      await supabase.from("api_logs").insert([
        {
          user_id: userId,
          status: "200 : Succès (latence 5s 🐢)",
          action: "CRYPTO_TX_USDC",
          agent: "Agent IA",
        },
      ]);

      const txHash = "0x" + Math.random().toString(16).slice(2);
      return NextResponse.json({
        success: true,
        message: "Transaction validée sur la blockchain",
        tx_hash: txHash,
      });
    }

    // Scénario par défaut : succès immédiat
    await supabase.from("api_logs").insert([
      {
        user_id: userId,
        status: "200 : Succès",
        action: "CRYPTO_TX_USDC",
        agent: "Agent IA",
      },
    ]);

    const txHash = "0x" + Math.random().toString(16).slice(2);
    return NextResponse.json({
      success: true,
      message: "Transaction validée sur la blockchain",
      tx_hash: txHash,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("ERREUR POST /api/crypto:", message);
    return NextResponse.json(
      { success: false, error: GENERIC_ERROR_MESSAGE },
      { status: 500 }
    );
  }
}

