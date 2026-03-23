create table if not exists public.amenities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.room_type_amenities (
  id uuid primary key default gen_random_uuid(),
  room_type_id uuid not null references public.room_types(id) on delete cascade,
  amenity_id uuid not null references public.amenities(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (room_type_id, amenity_id)
);

create index if not exists idx_room_type_amenities_room_type_id
  on public.room_type_amenities(room_type_id);

create index if not exists idx_room_type_amenities_amenity_id
  on public.room_type_amenities(amenity_id);
