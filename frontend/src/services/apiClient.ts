const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export const apiUrl = (path: string): string => {
  if (!configuredApiBaseUrl) {
    throw new Error("VITE_API_BASE_URL is not configured");
  }

  return `${configuredApiBaseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};

const getIdToken = (): string => {
  const token = localStorage.getItem("idToken");
  if (!token) {
    throw new ApiError("Your session has expired. Please sign in again.", 401);
  }
  return token;
};

export async function requestJson<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${getIdToken()}`);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(apiUrl(path), { ...init, headers });
  const contentType = response.headers.get("content-type") ?? "";
  const responseBody = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const apiMessage =
      typeof responseBody === "object" &&
      responseBody !== null &&
      "error" in responseBody
        ? String(responseBody.error)
        : `Request failed with status ${response.status}`;
    throw new ApiError(apiMessage, response.status, responseBody);
  }

  return responseBody as T;
}
