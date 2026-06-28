create table if not exists public.guest_id_verifications (
  vendor_data text primary key,
  session_id text unique,
  status text not null default 'Not Started',
  decision jsonb null,
  metadata jsonb null,
  resubmit_info jsonb null,
  verified_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint guest_id_verifications_status_check check (
    status in (
      'Not Started',
      'In Progress',
      'Awaiting User',
      'In Review',
      'Approved',
      'Declined',
      'Resubmitted',
      'Abandoned',
      'Expired',
      'Kyc Expired'
    )
  )
);

create index if not exists guest_id_verifications_session_id_idx
  on public.guest_id_verifications (session_id);

create index if not exists guest_id_verifications_status_idx
  on public.guest_id_verifications (status);

create table if not exists public.didit_webhook_events (
  event_id text primary key,
  session_id text null,
  webhook_type text null,
  status text null,
  received_at timestamptz not null default now()
);

create index if not exists didit_webhook_events_session_id_idx
  on public.didit_webhook_events (session_id);
