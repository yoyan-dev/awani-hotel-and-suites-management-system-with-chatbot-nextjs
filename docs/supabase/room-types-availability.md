CREATE OR REPLACE FUNCTION public.get_available_room_types(
checked_in date,
checked_out date,
guests int
)
RETURNS TABLE (
id uuid,
name text,
image text,
description text,
room_type_add_ons jsonb[],
room_size text,
max_guest int,
price numeric,
peak_season_price numeric
)
LANGUAGE sql STABLE
AS $$
SELECT
rt.id,
rt.name,
rt.image,
rt.description,
coalesce(
  (
    select jsonb_agg(
      jsonb_build_object(
        'id', rta.id,
        'quantity_limit', rta.quantity_limit,
        'inventory_id', rta.inventory_id
      )
    )
    from room_type_add_ons rta
    where rta.room_type_id = rt.id
  ),
  '[]'::jsonb
) as room_type_add_ons,
rt.room_size,
rt.max_guest,
rt.price,
rt.peak_season_price
FROM room_types rt
WHERE rt.max_guest <= guests -- 🔥 FILTER BY MAX GUEST
AND rt.id IN (
SELECT DISTINCT r.room_type_id
FROM rooms r
WHERE r.status IN ('vacant','dirty','occupied','booked')
AND NOT EXISTS (
SELECT 1
FROM bookings b
WHERE b.room_id = r.id
AND b.status IN ('checked_in','confirmed')
AND b.checked_in < checked_out
AND b.checked_out > checked_in
)
);

$$
;
$$
