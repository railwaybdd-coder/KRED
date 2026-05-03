-- ============================================================
-- KRED — Script SQL complet pour Supabase
-- Coller dans : Supabase → SQL Editor → New query → Run
-- ============================================================

-- 1. TABLE PRODUITS
create table if not exists produits (
  id          uuid primary key default gen_random_uuid(),
  nom         text not null,
  description text,
  prix_vente  integer not null,
  prix_achat  integer,
  categorie   text check (categorie in ('mobilier','electromenager','electronique')),
  etat        text check (etat in ('neuf','occasion_bon','occasion_tres_bon')),
  photos      text[] default '{}',
  disponible  boolean default true,
  created_at  timestamptz default now()
);

-- 2. TABLE CLIENTS
create table if not exists clients (
  id          uuid primary key default gen_random_uuid(),
  nom         text not null,
  prenom      text not null,
  telephone   text not null,
  whatsapp    text,
  adresse     text,
  ville       text default 'Rabat',
  type_piece  text,
  num_piece   text,
  created_at  timestamptz default now()
);

-- 3. TABLE COMMANDES
create table if not exists commandes (
  id            uuid primary key default gen_random_uuid(),
  client_id     uuid references clients(id) on delete set null,
  produit_id    uuid references produits(id) on delete set null,
  prix_total    integer not null,
  acompte       integer not null,
  reste_a_payer integer not null,
  statut        text check (statut in ('en_attente','valide','livre','solde','incident')) default 'en_attente',
  date_livraison date,
  date_echeance  date,
  notes         text,
  created_at    timestamptz default now()
);

-- 4. ROW LEVEL SECURITY
alter table produits  enable row level security;
alter table clients   enable row level security;
alter table commandes enable row level security;

-- 5. POLITIQUES : Produits publics (lecture catalogue)
drop policy if exists "produits_public_select" on produits;
create policy "produits_public_select" on produits
  for select using (disponible = true);

-- 6. POLITIQUES ADMIN (remplace TON_EMAIL par ton email Supabase Auth)
-- ⚠️ IMPORTANT : remplacer 'admin@kred.ma' par ton vrai email admin

drop policy if exists "admin_produits_all" on produits;
create policy "admin_produits_all" on produits
  for all using (auth.email() = 'admin@kred.ma')
  with check (auth.email() = 'admin@kred.ma');

drop policy if exists "admin_clients_all" on clients;
create policy "admin_clients_all" on clients
  for all using (auth.email() = 'admin@kred.ma')
  with check (auth.email() = 'admin@kred.ma');

drop policy if exists "admin_commandes_all" on commandes;
create policy "admin_commandes_all" on commandes
  for all using (auth.email() = 'admin@kred.ma')
  with check (auth.email() = 'admin@kred.ma');

-- 7. Permettre aux visiteurs d'INSERT dans clients et commandes
--    (pour le formulaire de commande public)
drop policy if exists "public_insert_clients" on clients;
create policy "public_insert_clients" on clients
  for insert with check (true);

drop policy if exists "public_insert_commandes" on commandes;
create policy "public_insert_commandes" on commandes
  for insert with check (true);

-- ============================================================
-- STORAGE : bucket produits-images
-- Aller dans Storage → New bucket → nom: produits-images → Public: OUI
-- Puis coller ces politiques :
-- ============================================================

-- Lecture publique des images
create policy "images_public_read" on storage.objects
  for select using (bucket_id = 'produits-images');

-- Upload admin uniquement
create policy "images_admin_insert" on storage.objects
  for insert with check (
    bucket_id = 'produits-images'
    and auth.email() = 'admin@kred.ma'
  );

-- Suppression admin uniquement
create policy "images_admin_delete" on storage.objects
  for delete using (
    bucket_id = 'produits-images'
    and auth.email() = 'admin@kred.ma'
  );
