import { useMutation } from "@tanstack/react-query";
import { api, type InsertDonation } from "@shared/routes";

export function useCreateDonation() {
  return useMutation({
    mutationFn: async (data: InsertDonation) => {
      const res = await fetch(api.donations.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to process donation");
      return api.donations.create.responses[201].parse(await res.json());
    },
  });
}
