-- Table des messages de contact (à exécuter dans Supabase SQL Editor)
create table if not exists contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists contact_requests_created_at_idx on contact_requests (created_at desc);
