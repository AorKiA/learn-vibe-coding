-- =============================================================================
-- 0001_init.sql — schema, constraints, triggers
-- Run this FIRST in Supabase SQL Editor, before 0002_rls.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- profiles : mirrors auth.users, holds the application role
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  role       text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- rooms : study rooms. Seeded in 0003, managed by admins through the app.
-- -----------------------------------------------------------------------------
create table if not exists public.rooms (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique check (char_length(btrim(name)) between 1 and 100),
  capacity   integer not null check (capacity > 0 and capacity <= 500),
  location   text check (char_length(location) <= 200),
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- time_slots : bookable periods. Read from the DB — never hard-coded in the app.
-- -----------------------------------------------------------------------------
create table if not exists public.time_slots (
  id         uuid primary key default gen_random_uuid(),
  label      text not null unique,
  start_time time not null,
  end_time   time not null,
  sort_order integer not null unique,
  constraint time_slots_end_after_start check (end_time > start_time)
);

-- -----------------------------------------------------------------------------
-- bookings
-- -----------------------------------------------------------------------------
create table if not exists public.bookings (
  id           uuid primary key default gen_random_uuid(),
  room_id      uuid not null references public.rooms (id) on delete restrict,
  slot_id      uuid not null references public.time_slots (id) on delete restrict,
  booking_date date not null,
  -- Defaulting to auth.uid() means the DB itself decides the owner. Even if a
  -- caller omits or forges user_id, the RLS insert policy re-checks it.
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  purpose      text not null check (char_length(btrim(purpose)) between 3 and 500),
  status       text not null default 'active' check (status in ('active', 'cancelled')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- AT#7 — the double-booking guard.
-- Partial: a cancelled booking must not block the slot from being rebooked.
-- This is what makes two concurrent inserts resolve to one success + one 23505.
create unique index if not exists bookings_no_double_booking
  on public.bookings (room_id, booking_date, slot_id)
  where status = 'active';

create index if not exists bookings_user_id_idx on public.bookings (user_id);
create index if not exists bookings_date_idx    on public.bookings (booking_date);

-- -----------------------------------------------------------------------------
-- is_admin()
-- SECURITY DEFINER is required: policies on `profiles` query `profiles`, and a
-- plain function would re-enter that table's RLS and recurse infinitely.
-- -----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- -----------------------------------------------------------------------------
-- Trigger 1 — every new auth user gets a profile row
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- Trigger 2 — a user must not promote themselves to admin
-- auth.uid() is null when running from the SQL Editor or a service-role client,
-- which is how an operator legitimately grants the first admin.
-- -----------------------------------------------------------------------------
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    raise exception 'insufficient_privilege: only an admin can change a role'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_escalation on public.profiles;
create trigger profiles_prevent_role_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_escalation();

-- -----------------------------------------------------------------------------
-- Trigger 3 — bookings.updated_at
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Trigger 4 — no booking in the past.
-- This lives in a trigger, not a CHECK constraint: CHECK requires IMMUTABLE
-- expressions and current_date is only STABLE, so Postgres rejects it there.
-- -----------------------------------------------------------------------------
create or replace function public.prevent_past_booking()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'active' and new.booking_date < current_date then
    raise exception 'booking_date_in_past: cannot book a date that has passed'
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists bookings_prevent_past on public.bookings;
create trigger bookings_prevent_past
  before insert or update on public.bookings
  for each row execute function public.prevent_past_booking();
