create table if not exists public.auth_activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  email text,
  role text,
  event_type text not null check (event_type in ('login', 'logout')),
  event_at timestamptz not null default now(),
  ip_address text,
  user_agent text
);

create index if not exists auth_activity_logs_user_id_idx
  on public.auth_activity_logs (user_id);

create index if not exists auth_activity_logs_event_at_idx
  on public.auth_activity_logs (event_at desc);
