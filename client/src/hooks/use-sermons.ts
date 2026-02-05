import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Sermon, InsertSermon } from "@/types/api";
import { buildApiUrl } from "@/lib/api-config";
import { apiRoutes } from "@/lib/api-routes";

export function useSermons() {
  return useQuery({
    queryKey: [apiRoutes.sermons.list],
    queryFn: async (): Promise<Sermon[]> => {
      const res = await fetch(buildApiUrl(apiRoutes.sermons.list));
      if (!res.ok) throw new Error("Failed to fetch sermons");
      return res.json();
    },
  });
}

export function useSermon(id: number) {
  return useQuery({
    queryKey: [apiRoutes.sermons.get(id)],
    queryFn: async (): Promise<Sermon> => {
      const res = await fetch(buildApiUrl(apiRoutes.sermons.get(id)));
      if (!res.ok) throw new Error("Failed to fetch sermon");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateSermon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertSermon): Promise<Sermon> => {
      const res = await fetch(buildApiUrl(apiRoutes.sermons.create), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create sermon");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiRoutes.sermons.list] });
    },
  });
}
