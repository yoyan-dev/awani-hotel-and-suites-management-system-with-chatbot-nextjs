const API_BEARER_TOKEN = process.env.NEXT_PUBLIC_API_BEARER_TOKEN;

function getRequiredApiBearerToken() {
  if (!API_BEARER_TOKEN) {
    throw new Error("Missing NEXT_PUBLIC_API_BEARER_TOKEN");
  }

  return API_BEARER_TOKEN;
}

export function apiFetch(input: RequestInfo | URL, init?: RequestInit) {
  const headers = new Headers(init?.headers);

  headers.set("Authorization", `Bearer ${getRequiredApiBearerToken()}`);

  return fetch(input, {
    ...init,
    headers,
  });
}
