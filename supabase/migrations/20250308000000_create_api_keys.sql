-- Table des clés API (à exécuter dans l'éditeur SQL Supabase)
-- Chaque clé est stockée sous forme de hash ; le préfixe sert à l'affichage.

create table if not exists api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  name text not null,
  key_prefix text not null,
  key_hash text not null unique,
  created_at timestamptz not null default now(),
  last_used_at timestamptz
);

create index if not exists api_keys_user_id_idx on api_keys (user_id);
create index if not exists api_keys_key_hash_idx on api_keys (key_hash);

comment on table api_keys is 'Clés API pour authentifier les appels à la sandbox (hash uniquement)';
