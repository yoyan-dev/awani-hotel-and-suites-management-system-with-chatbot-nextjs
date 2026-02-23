begin;

create table if not exists public.function_hall_payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.function_hall_bookings(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  payment_method text not null,
  notes text null,
  created_by uuid null,
  created_at timestamptz not null default now()
);

create index if not exists idx_function_hall_payments_booking_id
  on public.function_hall_payments (booking_id);

create index if not exists idx_function_hall_payments_created_at
  on public.function_hall_payments (created_at desc);

commit;
