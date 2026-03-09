# Supabase

## Migrations

Exécute le SQL des fichiers dans `migrations/` via le **SQL Editor** du dashboard Supabase (https://app.supabase.com → ton projet → SQL Editor).

- **20250308000000_create_api_keys.sql** : crée la table `api_keys` (clés API pour la sandbox). À lancer une fois avant d’utiliser la création de clés depuis le dashboard.
- **20250308100000_create_contact_requests.sql** : crée la table `contact_requests` (messages du formulaire Contact).
