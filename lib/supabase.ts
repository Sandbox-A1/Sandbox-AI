import { createClient } from '@supabase/supabase-js';

// On force Next.js à aller chercher exactement ces noms-là
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Débogage brutal : si ça plante, on saura exactement pourquoi
if (!supabaseUrl) {
  throw new Error("🚨 ERREUR CRITIQUE : NEXT_PUBLIC_SUPABASE_URL est introuvable. Ton fichier .env.local n'est pas lu !");
}
if (!supabaseAnonKey) {
  throw new Error("🚨 ERREUR CRITIQUE : NEXT_PUBLIC_SUPABASE_ANON_KEY est introuvable.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Crée un client Supabase authentifié avec le JWT Clerk (template "supabase").
 * À utiliser dans les API routes quand la RLS est activée.
 */
export function createSupabaseWithToken(accessToken: string) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}