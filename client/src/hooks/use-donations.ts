import { useMutation } from "@tanstack/react-query";
import type { InsertDonation, Donation } from "@/types/api";
import { buildApiUrl } from "@/lib/api-config";
import { apiRoutes } from "@/lib/api-routes";

export function useCreateDonation() {
  return useMutation({
    mutationFn: async (data: InsertDonation): Promise<Donation> => {
      const res = await fetch(buildApiUrl(apiRoutes.donations.create), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to process donation");
      return res.json();
    },
  });
}
