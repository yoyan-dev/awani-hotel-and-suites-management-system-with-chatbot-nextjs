alter table if exists public.auth_activity_logs
  add column if not exists device_name text;
