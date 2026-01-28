import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertSermon } from "@shared/routes";

export function useSermons() {
  return useQuery({
    queryKey: [api.sermons.list.path],
    queryFn: async () => {
      const res = await fetch(api.sermons.list.path);
      if (!res.ok) throw new Error("Failed to fetch sermons");
      return api.sermons.list.responses[200].parse(await res.json());
    },
  });
}

export function useSermon(id: number) {
  return useQuery({
    queryKey: [api.sermons.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.sermons.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch sermon");
      return api.sermons.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateSermon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertSermon) => {
      const res = await fetch(api.sermons.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create sermon");
      return api.sermons.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.sermons.list.path] });
    },
  });
}
