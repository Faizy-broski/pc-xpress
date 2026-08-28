-- PC Xpress — customer-facing catalog schema
--
-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query)
-- before using the app. Safe to re-run: every statement is idempotent.
--
-- Scope: only the catalogs customers browse on the public site — Prebuilt PCs,
-- Custom Build parts/categories, and the Repairs device/brand/fault catalog.
-- Bookings, orders, customers, and inventory stay as local admin-only mock
-- data and are not part of this schema.
--
-- Security note: the write policies below start permissive (USING (true))
-- so the dashboard works before any auth system exists. Once you've set up
-- admin login (see proxy.ts, lib/auth/admin.ts), run
-- supabase/auth-policies.sql to replace these with authenticated-only
-- write policies.

-- ── Prebuilt PCs ─────────────────────────────────────────────────────────
create table if not exists prebuilt_products (
  slug text primary key,
  sku text not null,
  name text not null,
  category text not null check (category in ('Gaming', 'Creator', 'Office')),
  badge text check (badge in ('Best Seller', 'New', 'Editor''s Pick') or badge is null),
  tagline text not null,
  description text not null,
  images text[] not null default '{}',
  os text not null,
  rating numeric not null default 5,
  review_count integer not null default 0,
  price numeric not null,
  was_price numeric,
  dispatch_date text not null,
  in_stock boolean not null default true,
  highlights text[] not null default '{}',
  specs jsonb not null default '[]',
  whats_included text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table prebuilt_products enable row level security;

drop policy if exists "prebuilt_products_public_read" on prebuilt_products;
create policy "prebuilt_products_public_read" on prebuilt_products
  for select using (true);

drop policy if exists "prebuilt_products_public_write" on prebuilt_products;
create policy "prebuilt_products_public_write" on prebuilt_products
  for all using (true) with check (true);

-- ── Custom Build catalog (categories + parts) ───────────────────────────
create table if not exists categories (
  id text primary key,
  label text not null,
  icon text not null,
  description text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table categories enable row level security;

drop policy if exists "categories_public_read" on categories;
create policy "categories_public_read" on categories
  for select using (true);

drop policy if exists "categories_public_write" on categories;
create policy "categories_public_write" on categories
  for all using (true) with check (true);

create table if not exists parts (
  id text not null,
  category_id text not null references categories(id) on delete cascade,
  name text not null,
  price numeric not null,
  specs text[] not null default '{}',
  in_stock boolean not null default true,
  badge text,
  socket text,
  created_at timestamptz not null default now(),
  primary key (category_id, id)
);

alter table parts enable row level security;

drop policy if exists "parts_public_read" on parts;
create policy "parts_public_read" on parts
  for select using (true);

drop policy if exists "parts_public_write" on parts;
create policy "parts_public_write" on parts
  for all using (true) with check (true);

-- ── Repairs catalog (device types + brands + faults) ────────────────────
create table if not exists device_types (
  id text primary key,
  label text not null,
  icon text not null,
  description text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table device_types enable row level security;

drop policy if exists "device_types_public_read" on device_types;
create policy "device_types_public_read" on device_types
  for select using (true);

drop policy if exists "device_types_public_write" on device_types;
create policy "device_types_public_write" on device_types
  for all using (true) with check (true);

create table if not exists brands (
  id text not null,
  device_type_id text not null references device_types(id) on delete cascade,
  label text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (device_type_id, id)
);

alter table brands enable row level security;

drop policy if exists "brands_public_read" on brands;
create policy "brands_public_read" on brands
  for select using (true);

drop policy if exists "brands_public_write" on brands;
create policy "brands_public_write" on brands
  for all using (true) with check (true);

create table if not exists faults (
  id text not null,
  device_type_id text not null references device_types(id) on delete cascade,
  label text not null,
  description text not null,
  price_from numeric not null,
  eta_label text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (device_type_id, id)
);

alter table faults enable row level security;

drop policy if exists "faults_public_read" on faults;
create policy "faults_public_read" on faults
  for select using (true);

drop policy if exists "faults_public_write" on faults;
create policy "faults_public_write" on faults
  for all using (true) with check (true);
