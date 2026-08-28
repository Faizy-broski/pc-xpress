-- PC Xpress — product image storage
--
-- Run this once in the Supabase SQL Editor, alongside supabase/schema.sql.
-- Creates a public bucket for prebuilt PC photos uploaded from the admin
-- dashboard, and the storage policies that let the app read/write it.
--
-- Security note: same caveat as schema.sql — these write/delete policies
-- start permissive. Once admin login is set up, run
-- supabase/auth-policies.sql to require an authenticated session for
-- uploads/deletes.

insert into storage.buckets (id, name, public)
values ('prebuilt-images', 'prebuilt-images', true)
on conflict (id) do nothing;

drop policy if exists "prebuilt_images_public_read" on storage.objects;
create policy "prebuilt_images_public_read" on storage.objects
  for select using (bucket_id = 'prebuilt-images');

drop policy if exists "prebuilt_images_public_write" on storage.objects;
create policy "prebuilt_images_public_write" on storage.objects
  for insert with check (bucket_id = 'prebuilt-images');

drop policy if exists "prebuilt_images_public_delete" on storage.objects;
create policy "prebuilt_images_public_delete" on storage.objects
  for delete using (bucket_id = 'prebuilt-images');
