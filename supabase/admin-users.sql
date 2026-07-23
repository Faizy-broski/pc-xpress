-- PC Xpress — dashboard-managed admin users
--
-- Run this once in the Supabase SQL Editor, after schema.sql, storage.sql,
-- and auth-policies.sql. Safe to re-run.
--
-- Context: there is no public sign-up anymore. The only ways to gain access
-- to /dashboard are (1) being listed in the ADMIN_EMAILS env var (the
-- permanent "owner" allowlist), or (2) being added here by an existing admin
-- via the dashboard's Admin Users panel (app/actions/admin-users.ts), which
-- creates the Supabase Auth account directly with a temporary password.
--
-- `id` matches the corresponding auth.users.id so reset/remove actions can
-- target the Auth Admin API without an extra lookup.

create table if not exists admin_users (
  id uuid primary key,
  email text unique not null,
  created_at timestamptz not null default now()
);

alter table admin_users enable row level security;

-- No public policy at all — only an already-authenticated session (i.e.
-- someone who already passed the ADMIN_EMAILS/admin_users check to log in)
-- can read or write this table. Owners always have dashboard access via
-- ADMIN_EMAILS regardless of what's in this table.
drop policy if exists "admin_users_authenticated_all" on admin_users;
create policy "admin_users_authenticated_all" on admin_users
  for all using (auth.uid() is not null) with check (auth.uid() is not null);