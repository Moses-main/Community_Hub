// client/src/lib/api.ts
import { buildApiUrl } from "@/lib/api-config";
import { apiRoutes } from "@/lib/api-routes";

export const verifyEmail = async (token: string) => {
  const url = buildApiUrl(`${apiRoutes.auth.verifyEmail}?token=${encodeURIComponent(token)}`);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to verify email");
  }

  return response.json();
};