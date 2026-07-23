-- PC Xpress — pre-built PC orders (Stripe checkout)
--
-- Run this once in the Supabase SQL Editor, alongside the other supabase/*.sql
-- files. Safe to re-run.
--
-- Context: checkout is guest-only (no customer accounts), so every write to
-- this table happens server-side — the checkout API route creates a
-- "Awaiting Payment" row before redirecting to Stripe, and the Stripe webhook
-- flips it to "Processing" once payment is confirmed — both using the
-- service-role client (lib/supabase/admin.ts), which bypasses RLS entirely.
-- The only policy needed here is read access for the admin dashboard.

create table if not exists orders (
  id text primary key,
  stripe_session_id text unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_address jsonb not null default '{}',
  items jsonb not null default '[]',
  product_summary text not null,
  subtotal numeric not null,
  total numeric not null,
  status text not null default 'Awaiting Payment',
  created_at timestamptz not null default now()
);

alter table orders enable row level security;

-- No public policy at all — guests never read/write this table directly.
-- Authenticated (admin) sessions can read and, since the dashboard's status
-- dropdown/edit modal write through the user's own session, also write.
drop policy if exists "orders_authenticated_all" on orders;
create policy "orders_authenticated_all" on orders
  for all using (auth.uid() is not null) with check (auth.uid() is not null);
