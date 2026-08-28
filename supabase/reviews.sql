-- PC Xpress — customer reviews (Pre-built PC, Custom Build, Repair)
--
-- Run this once in the Supabase SQL Editor, alongside the other supabase/*.sql
-- files. Safe to re-run.
--
-- Context: there are no customer accounts (see orders.sql), so submissions are
-- guest writes — the public review form posts to /api/reviews, which uses the
-- service-role client (lib/supabase/admin.ts) to insert a row that always
-- starts "Pending", regardless of what the client sends. Reviews only become
-- publicly visible once an admin marks them "Published" from the dashboard.

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('Pre-built PC', 'Custom Build', 'Repair')),
  reference text,
  reference_label text,
  customer_name text not null,
  customer_email text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  status text not null default 'Pending' check (status in ('Pending', 'Published', 'Rejected')),
  created_at timestamptz not null default now()
);

alter table reviews enable row level security;

-- Public can only ever read reviews an admin has published.
drop policy if exists "reviews_public_read_published" on reviews;
create policy "reviews_public_read_published" on reviews
  for select using (status = 'Published');

-- Admin dashboard (authenticated session) can read/moderate/delete everything.
-- No public insert policy — submissions go through the service-role client.
drop policy if exists "reviews_authenticated_all" on reviews;
create policy "reviews_authenticated_all" on reviews
  for all using (auth.uid() is not null) with check (auth.uid() is not null);
