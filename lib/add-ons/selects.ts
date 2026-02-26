export const ROOM_TYPE_ADD_ONS_SELECT = `
  *,
  room_type_add_ons (
    id,
    room_type_id,
    inventory_id,
    add_on_id:inventory_id,
    quantity_limit,
    add_on:inventory_id (
      id,
      name,
      price,
      quantity,
      status,
      description
    )
  )
`;
