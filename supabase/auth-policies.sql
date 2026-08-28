-- PC Xpress — tighten catalog write access now that admin auth exists
--
-- Run this once in the Supabase SQL Editor, after schema.sql and storage.sql.
-- Safe to re-run.
--
-- Context: schema.sql and storage.sql originally left every write policy as
-- `using (true)` because the project had no authentication system and only
-- an anon/publishable key. Now that the admin dashboard signs in real users
-- via Supabase Auth (see proxy.ts, app/dashboard/layout.tsx, lib/auth/admin.ts),
-- writes should require an authenticated session. This does NOT check the
-- ADMIN_EMAILS allowlist at the database level — that's enforced in the app
-- layer (proxy.ts + dashboard layout) before a session cookie ever reaches
-- these API routes. This SQL only closes the door on anonymous/public writes
-- (e.g. someone calling the REST API directly with just the anon key).
--
-- Public SELECT policies are unchanged — the storefront still reads catalogs
-- without a session.

-- ── Prebuilt PCs ─────────────────────────────────────────────────────────
drop policy if exists "prebuilt_products_public_write" on prebuilt_products;
create policy "prebuilt_products_authenticated_write" on prebuilt_products
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- ── Custom Build catalog (categories + parts) ───────────────────────────
drop policy if exists "categories_public_write" on categories;
create policy "categories_authenticated_write" on categories
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists "parts_public_write" on parts;
create policy "parts_authenticated_write" on parts
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- ── Repairs catalog (device types + brands + faults) ────────────────────
drop policy if exists "device_types_public_write" on device_types;
create policy "device_types_authenticated_write" on device_types
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists "brands_public_write" on brands;
create policy "brands_authenticated_write" on brands
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists "faults_public_write" on faults;
create policy "faults_authenticated_write" on faults
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- ── Product image storage ────────────────────────────────────────────────
drop policy if exists "prebuilt_images_public_write" on storage.objects;
create policy "prebuilt_images_authenticated_write" on storage.objects
  for insert with check (bucket_id = 'prebuilt-images' and auth.uid() is not null);

drop policy if exists "prebuilt_images_public_delete" on storage.objects;
create policy "prebuilt_images_authenticated_delete" on storage.objects
  for delete using (bucket_id = 'prebuilt-images' and auth.uid() is not null);
