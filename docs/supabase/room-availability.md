CREATE OR REPLACE FUNCTION get_room_availability(
checked_in date,
checked_out date,
selected_date date,
room_type_id text,
room_status text
)
RETURNS TABLE (
id uuid,
room_number text,
room_type_id text,
status text,
availability text
) AS $$
SELECT
r.id,
r.room_number,
r.room_type_id,
r.status,
CASE
WHEN r.status NOT IN ('vacant', 'dirty', 'occupied', 'available') THEN 'not available'
WHEN selected_date IS NOT NULL AND EXISTS (
SELECT 1 FROM bookings b
WHERE b.room_id = r.id
AND b.status IN ('checked_in', 'confirmed')
AND b.checked_in <= selected_date
AND b.checked_out > selected_date
) THEN 'booked'
WHEN selected_date IS NULL AND checked_in IS NOT NULL AND checked_out IS NOT NULL AND EXISTS (
SELECT 1 FROM bookings b
WHERE b.room_id = r.id
AND b.status IN ('checked_in', 'confirmed')
AND b.checked_in < checked_out
AND b.checked_out > checked_in
) THEN 'booked'
ELSE 'available'
END AS availability
FROM rooms r
WHERE
(room_type_id IS NULL OR r.room_type_id = room_type_id)
AND (room_status IS NULL OR r.status = room_status);

$$
LANGUAGE sql STABLE;
$$
