import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function hashKey(key: string): string {
  return createHash("sha256").update(key, "utf8").digest("hex");
}

/**
 * Retourne l'userId de la requête : soit depuis la session Clerk, soit depuis
 * le header Authorization: Bearer <api_key> (lookup dans api_keys).
 */
export async function getUserIdFromRequest(req: Request): Promise<string | null> {
  const { userId } = await auth();
  if (userId) return userId;

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7).trim();
  if (!token) return null;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const keyHash = hashKey(token);

  const { data } = await supabase
    .from("api_keys")
    .select("user_id, id")
    .eq("key_hash", keyHash)
    .single();

  if (!data?.user_id) return null;

  await supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id);

  return data.user_id;
}

export function hashApiKey(key: string): string {
  return hashKey(key);
}
