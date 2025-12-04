CREATE OR REPLACE FUNCTION get_room_availability(
check_in date,
check_out date,
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
AND b.status IN ('check-in', 'confirmed')
AND b.check_in <= selected_date
AND b.check_out > selected_date
) THEN 'booked'
WHEN selected_date IS NULL AND check_in IS NOT NULL AND check_out IS NOT NULL AND EXISTS (
SELECT 1 FROM bookings b
WHERE b.room_id = r.id
AND b.status IN ('check-in', 'confirmed')
AND b.check_in < check_out
AND b.check_out > check_in
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
