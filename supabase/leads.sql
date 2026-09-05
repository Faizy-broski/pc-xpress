-- PC Xpress — homepage lead-gen form (hero section)
--
-- Run this once in the Supabase SQL Editor, alongside the other supabase/*.sql
-- files. Safe to re-run.
--
-- Context: no customer accounts (see orders.sql), so submissions are guest
-- writes — the public hero form posts to /api/leads, which uses the
-- service-role client (lib/supabase/admin.ts) to insert a row. No emails are
-- sent; the only consumer is the admin dashboard's Leads table.

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text,
  status text not null default 'New' check (status in ('New', 'Contacted', 'Closed')),
  created_at timestamptz not null default now()
);

alter table leads enable row level security;

-- No public read/insert policy — submissions and reads both go through the
-- service-role client (create) or an authenticated admin session (read).
drop policy if exists "leads_authenticated_all" on leads;
create policy "leads_authenticated_all" on leads
  for all using (auth.uid() is not null) with check (auth.uid() is not null);
