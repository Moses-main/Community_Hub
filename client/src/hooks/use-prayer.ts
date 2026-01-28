import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertPrayerRequest } from "@shared/routes";

export function usePrayerRequests() {
  return useQuery({
    queryKey: [api.prayer.list.path],
    queryFn: async () => {
      const res = await fetch(api.prayer.list.path);
      if (!res.ok) throw new Error("Failed to fetch prayer requests");
      return api.prayer.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreatePrayerRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertPrayerRequest) => {
      const res = await fetch(api.prayer.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create prayer request");
      return api.prayer.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.prayer.list.path] });
    },
  });
}

export function usePrayForRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.prayer.pray.path, { id });
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to pray for request");
      return api.prayer.pray.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.prayer.list.path] });
    },
  });
}
