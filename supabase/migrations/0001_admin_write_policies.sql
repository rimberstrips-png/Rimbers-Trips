-- Admin write access for public.hotels
--
-- The existing policy on public.hotels only allows anonymous/public SELECT
-- of rows where is_active = true (for the Flutter app's public listing).
-- This migration adds the policies needed for the admin panel at /admin:
--
--   1. Authenticated users may SELECT all rows, including inactive ones,
--      so the admin table can show hidden listings alongside live ones.
--      (This is a second, additive permissive policy — Postgres RLS OR's
--      multiple permissive policies together, so the public is_active=true
--      policy keeps working unchanged for anonymous requests.)
--   2. Authenticated users may INSERT, UPDATE and DELETE rows.
--
-- Only one admin account will ever exist for this project (created directly
-- in Supabase Auth), so `auth.uid() is not null` is used as the scoping
-- condition instead of a roles table.

alter table public.hotels enable row level security;

create policy "Authenticated users can view all hotels"
  on public.hotels
  for select
  to authenticated
  using (auth.uid() is not null);

create policy "Authenticated users can insert hotels"
  on public.hotels
  for insert
  to authenticated
  with check (auth.uid() is not null);

create policy "Authenticated users can update hotels"
  on public.hotels
  for update
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

create policy "Authenticated users can delete hotels"
  on public.hotels
  for delete
  to authenticated
  using (auth.uid() is not null);
