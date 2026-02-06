export type OccupancyType = "available" | "half occupied" | "full occupied";

export const getOccupancyColor = (occupancy: OccupancyType) => {
  switch (occupancy) {
    case "available":
      return "success";
    case "half occupied":
      return "warning";
    case "full occupied":
      return "danger";
    default:
      return "default";
  }
};
