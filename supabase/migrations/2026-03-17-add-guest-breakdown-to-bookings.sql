begin;

alter table if exists public.bookings
add column if not exists guest_breakdown jsonb null;

commit;
