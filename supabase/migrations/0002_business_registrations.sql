-- Business self-registration with admin approval
--
-- `profiles` records whether a signed-in Google account is being used as a
-- "customer" or a "business" account, so the business signup flow can detect
-- and reject an account that's already in use as a customer (per product
-- decision: one Google account should not double as both).
--
-- `businesses` stores the actual registration submitted through the 4-step
-- business signup form. New rows always start life as `status = 'pending'`
-- (enforced by the insert policy's WITH CHECK, not just the column default)
-- and only become visible/manageable in the app once an admin approves them
-- from the admin panel.
--
-- Matching the hotels table's existing security model in this project,
-- writes are scoped to `auth.uid() is not null` rather than a dedicated
-- admin role — so any authenticated user can currently approve/reject a
-- business, the same tradeoff already accepted for hotel management.

create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('customer', 'business')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can create their own profile"
  on public.profiles
  for insert
  to authenticated
  with check (user_id = auth.uid());

create table public.businesses (
  id bigint generated always as identity primary key,
  owner_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  business_name text not null,
  business_email text,
  phone text,
  country text,
  business_type text,
  legal_name text,
  display_name text,
  category text,
  license_number text,
  tax_info text,
  website text,
  description text,
  address text,
  city text,
  postal_code text,
  map_link text,
  latitude text,
  longitude text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users (id)
);

alter table public.businesses enable row level security;

create policy "Authenticated users can view all businesses"
  on public.businesses
  for select
  to authenticated
  using (auth.uid() is not null);

create policy "Owners can register their own business as pending"
  on public.businesses
  for insert
  to authenticated
  with check (owner_id = auth.uid() and status = 'pending');

create policy "Authenticated users can review businesses"
  on public.businesses
  for update
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);
