// lib/api.ts

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

interface ApiOptions extends RequestInit {
  token?: string;
}

export async function api<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const { token, headers, ...fetchOptions } = options;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    let message = "Something went wrong.";

    try {
      const data = await response.json();

      if (data?.message) {
        message = data.message;
      } else if (data?.errors) {
        const firstError = Object.values(data.errors)[0];

        if (Array.isArray(firstError)) {
          message = String(firstError[0]);
        }
      }
    } catch {
      // Ignore invalid JSON responses.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}