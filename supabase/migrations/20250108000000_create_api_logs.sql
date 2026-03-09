-- Table des logs d'appels API (Sandbox AI)
-- Exécuter dans l'éditeur SQL Supabase ou via une migration.

create table if not exists public.api_logs (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  action text not null,
  status text not null,
  agent text not null,
  created_at timestamptz default now()
);

-- Index pour les requêtes par user_id (dashboard)
create index if not exists api_logs_user_id_created_at_idx
  on public.api_logs (user_id, created_at desc);

-- Optionnel : RLS si vous utilisez aussi le client anon côté client
-- alter table public.api_logs enable row level security;
-- create policy "Users can read own logs"
--   on public.api_logs for select
--   using (auth.uid()::text = user_id);
-- (Avec Clerk, user_id est l'ID Clerk ; les lectures passent par l'API avec service_role.)
