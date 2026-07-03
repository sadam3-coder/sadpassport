-- ============================================================
-- Migration: customer ownership, profiles, and RLS
-- ============================================================

-- ------------------------------------------------------------
-- 1. CUSTOMERS TABLE
-- ------------------------------------------------------------
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  customer_code text unique not null,
  full_name text not null,
  service_type text default 'Passport',
  sub_service_type text,
  passport_type text default 'Ordinary',
  appointment_type text,
  appointment_date date,
  birth_date date,
  birth_place text,
  week int,
  month text,
  year int,
  phone_number text,
  email text,
  passport_status text default 'Not started',
  application_no text,
  reference_number text,
  receipt_passport_number text,
  amount_paid numeric default 0,
  date_of_issue date,
  gender text,
  served_by text,
  marital_status text,
  immigration_place text,
  work_type text,
  coming_platform text,
  referral_details text,
  url text,
  address text,
  remarks text,
  smart_services_needed boolean default false,
  account_status text default 'Active',
  membership_level text,
  birth_certificate_url text,
  kebele_id_url text,
  national_id_url text,
  receipt_passport_number_url text,
  receipt_passport_picture_url text,
  appointment_paper_url text,
  photo_url text,
  passport_url text,
  court_document_url text,
  police_report_url text,
  receipt_url text,
  created_by uuid references auth.users(id) on delete set null,
  created_by_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists customers_updated_at on public.customers;
create trigger customers_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 2. PROFILES TABLE (name + role, one row per user)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row on signup, using the name passed in
-- signUp's options.data.full_name
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- 3. HELPER: is this uid an admin?
-- ------------------------------------------------------------
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = uid and role = 'admin'
  );
$$;

-- ------------------------------------------------------------
-- 4. RLS ON CUSTOMERS — own rows only, admin sees everything
-- (Drops any pre-existing wide-open policies first, e.g. from
-- an earlier "USING (true) for authenticated" schema.)
-- ------------------------------------------------------------
alter table public.customers enable row level security;

drop policy if exists "Authenticated can view customers" on public.customers;
drop policy if exists "Authenticated can insert customers" on public.customers;
drop policy if exists "Authenticated can update customers" on public.customers;
drop policy if exists "Authenticated can delete customers" on public.customers;

drop policy if exists "customers_select_own_or_admin" on public.customers;
create policy "customers_select_own_or_admin" on public.customers
  for select to authenticated using (
    created_by = auth.uid() or public.is_admin(auth.uid())
  );

drop policy if exists "customers_insert_own" on public.customers;
create policy "customers_insert_own" on public.customers
  for insert to authenticated with check (created_by = auth.uid());

-- WITH CHECK here prevents a user from reassigning created_by to
-- someone else via a direct API call, not just filtering which
-- rows they can target.
drop policy if exists "customers_update_own_or_admin" on public.customers;
create policy "customers_update_own_or_admin" on public.customers
  for update to authenticated
  using (
    created_by = auth.uid() or public.is_admin(auth.uid())
  )
  with check (
    created_by = auth.uid() or public.is_admin(auth.uid())
  );

drop policy if exists "customers_delete_own_or_admin" on public.customers;
create policy "customers_delete_own_or_admin" on public.customers
  for delete to authenticated using (
    created_by = auth.uid() or public.is_admin(auth.uid())
  );

-- ------------------------------------------------------------
-- 5. STORAGE BUCKET for document uploads
-- Files are uploaded to a path like "<user-id>/<filename>",
-- so ownership is enforced by matching the first path segment.
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('customer-documents', 'customer-documents', true)
on conflict (id) do nothing;

drop policy if exists "doc_upload_own_folder" on storage.objects;
create policy "doc_upload_own_folder" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'customer-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "doc_read_own_or_admin" on storage.objects;
create policy "doc_read_own_or_admin" on storage.objects
  for select to authenticated using (
    bucket_id = 'customer-documents'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin(auth.uid()))
  );

drop policy if exists "doc_public_read" on storage.objects;
create policy "doc_public_read" on storage.objects
  for select to anon using (bucket_id = 'customer-documents');

-- ------------------------------------------------------------
-- 6. ONE-TIME: promote your admin account
-- Run this AFTER that person has signed up once (so their
-- profiles row exists). Replace the email.
-- ------------------------------------------------------------
-- update public.profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'admin@yourcompany.com');
