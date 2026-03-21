type ApiRouteErrorColor = "success" | "danger" | "warning" | "error";

type ApiRouteErrorOptions = {
  status?: number;
  title?: string;
  color?: ApiRouteErrorColor;
  extra?: Record<string, unknown>;
};

export class ApiRouteError extends Error {
  status: number;
  title: string;
  color: ApiRouteErrorColor;
  extra?: Record<string, unknown>;

  constructor(message: string, options: ApiRouteErrorOptions = {}) {
    super(message);
    this.name = "ApiRouteError";
    this.status = options.status ?? 500;
    this.title = options.title ?? "Error";
    this.color = options.color ?? "danger";
    this.extra = options.extra;
  }
}

export function isApiRouteError(error: unknown): error is ApiRouteError {
  return error instanceof ApiRouteError;
}
