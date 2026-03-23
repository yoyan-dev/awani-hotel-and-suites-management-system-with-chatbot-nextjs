-- Verified by static code scan (excluding generated schema/types, docs, and offline seed files)
-- Date: 2026-02-23
-- Candidates with zero code references:
-- 1) public.function_hall_bookings.banquet_package_id
-- 2) public.users.valid_id_image
--
-- NOTE:
-- - Run in a staging DB first.
-- - This script intentionally avoids CASCADE so hidden dependencies fail safely.

begin;

alter table public.function_hall_bookings
  drop column if exists banquet_package_id;

alter table public.users
  drop column if exists valid_id_image;

commit;
