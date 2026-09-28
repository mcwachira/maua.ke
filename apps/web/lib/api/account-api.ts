export interface Address {
  id: string | number;
  label: string;
  line1: string;
  city: string;
  phone: string | null;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAddressInput {
  label: string;
  line1: string;
  city: string;
  phone?: string;
  is_default?: boolean;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function api<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
    },
  );

  if (!response.ok) {
    let message = "Something went wrong.";

    try {
      const data = await response.json();

      message =
        data.message ||
        data.error ||
        message;
    } catch {
      // Keep default message.
    }

    throw new Error(message);
  }

  return response.json();
}

export async function getAddresses() {
  return api<Address[]>("/api/addresses");
}

export async function createAddress(
  values: CreateAddressInput,
) {
  return api<Address>("/api/addresses", {
    method: "POST",
    body: JSON.stringify(values),
  });
}

export async function deleteAddress(
  id: string | number,
) {
  return api<void>(`/api/addresses/${id}`, {
    method: "DELETE",
  });
}