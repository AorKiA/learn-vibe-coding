-- =============================================================================
-- 0004_harden_functions.sql — close the gaps the Supabase security advisor found
-- Run AFTER 0003_seed.sql.
--
-- Two separate problems:
--
-- 1. A function without `set search_path` resolves unqualified names using the
--    caller's search_path. Combined with SECURITY DEFINER that is a privilege
--    escalation route, so pin it on every function we own.
--
-- 2. Postgres grants EXECUTE on new functions to PUBLIC by default, and
--    PostgREST exposes anything in the `public` schema at /rest/v1/rpc/<name>.
--    That put our trigger functions on the open internet. Calling them would
--    fail (a trigger function has no NEW record outside a trigger), but they
--    have no business being reachable at all.
-- =============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.prevent_past_booking()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.status = 'active' and new.booking_date < current_date then
    raise exception 'booking_date_in_past: cannot book a date that has passed'
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;

-- Trigger functions: nobody calls these directly. The triggers themselves still
-- fire, because a trigger runs with the table owner's rights, not the caller's.
revoke all on function public.handle_new_user()          from public, anon, authenticated;
revoke all on function public.prevent_role_escalation()  from public, anon, authenticated;
revoke all on function public.set_updated_at()           from public, anon, authenticated;
revoke all on function public.prevent_past_booking()     from public, anon, authenticated;

-- is_admin() is different: RLS policies evaluate it as the calling role, so
-- `authenticated` genuinely needs EXECUTE. Signed-out callers never do.
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
