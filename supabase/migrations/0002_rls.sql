-- =============================================================================
-- 0002_rls.sql — Row Level Security
-- Run AFTER 0001_init.sql.
--
-- This file is the actual security boundary of the application. Hiding buttons
-- in the UI is UX; these policies are what stop user B from touching user A's
-- data when they call the REST API directly with their own token.
-- =============================================================================

alter table public.profiles   enable row level security;
alter table public.rooms      enable row level security;
alter table public.time_slots enable row level security;
alter table public.bookings   enable row level security;

-- -----------------------------------------------------------------------------
-- profiles
-- -----------------------------------------------------------------------------
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

-- No insert policy on purpose: rows are created only by the SECURITY DEFINER
-- trigger handle_new_user(), which bypasses RLS.

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());
-- role changes are blocked separately by the prevent_role_escalation trigger

drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all on public.profiles
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- rooms — everyone signed in can read; only admins can write
-- -----------------------------------------------------------------------------
drop policy if exists rooms_select on public.rooms;
create policy rooms_select on public.rooms
  for select to authenticated
  using (true);

drop policy if exists rooms_admin_write on public.rooms;
create policy rooms_admin_write on public.rooms
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- time_slots — same shape as rooms
-- -----------------------------------------------------------------------------
drop policy if exists time_slots_select on public.time_slots;
create policy time_slots_select on public.time_slots
  for select to authenticated
  using (true);

drop policy if exists time_slots_admin_write on public.time_slots;
create policy time_slots_admin_write on public.time_slots
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- bookings — the core rule
-- -----------------------------------------------------------------------------

-- Read: any signed-in user sees every booking. Requirement 4 says users must be
-- able to see which slots are already taken before creating a new one, and that
-- needs rows from other people.
--
-- Trade-off: this also exposes other people's `purpose` text over the REST API.
-- The UI only renders "ไม่ว่าง" for someone else's booking. To close it fully,
-- narrow this policy to (user_id = auth.uid() or public.is_admin()) and read
-- availability through a view exposing only room_id/booking_date/slot_id.
drop policy if exists bookings_select on public.bookings;
create policy bookings_select on public.bookings
  for select to authenticated
  using (true);

-- Insert: the row must belong to the caller. Combined with the
-- `default auth.uid()` column default, a forged user_id in the request body is
-- rejected here rather than silently trusted.
drop policy if exists bookings_insert_own on public.bookings;
create policy bookings_insert_own on public.bookings
  for insert to authenticated
  with check (user_id = auth.uid());

-- Update: owner or admin. WITH CHECK repeats the condition so a user cannot
-- reassign a booking to somebody else on the way out.
drop policy if exists bookings_update_own on public.bookings;
create policy bookings_update_own on public.bookings
  for update to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

drop policy if exists bookings_delete_own on public.bookings;
create policy bookings_delete_own on public.bookings
  for delete to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- -----------------------------------------------------------------------------
-- Anonymous callers get nothing. No policy grants `anon` anything above, so
-- every table is closed to unauthenticated requests by default.
-- -----------------------------------------------------------------------------
