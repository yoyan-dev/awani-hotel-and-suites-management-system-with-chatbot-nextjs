import { isApiRouteError } from "@/lib/api/route-error";
import { apiFailure } from "@/utils/api/responses";

export function apiErrorResponse(
  error: unknown,
  fallbackDescription = "Something went wrong",
) {
  if (isApiRouteError(error)) {
    return apiFailure(
      error.message,
      error.status,
      error.title,
      error.color,
      error.extra,
    );
  }

  if (error instanceof Error) {
    return apiFailure(error.message || fallbackDescription);
  }

  return apiFailure(fallbackDescription);
}
