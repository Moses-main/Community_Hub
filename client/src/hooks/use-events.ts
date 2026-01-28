import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertEvent } from "@shared/routes";

export function useEvents() {
  return useQuery({
    queryKey: [api.events.list.path],
    queryFn: async () => {
      const res = await fetch(api.events.list.path);
      if (!res.ok) throw new Error("Failed to fetch events");
      return api.events.list.responses[200].parse(await res.json());
    },
  });
}

export function useEvent(id: number) {
  return useQuery({
    queryKey: [api.events.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.events.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch event");
      return api.events.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertEvent) => {
      const res = await fetch(api.events.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create event");
      return api.events.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.events.list.path] });
    },
  });
}

export function useRsvpEvent() {
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.events.rsvp.path, { id });
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to RSVP");
      return api.events.rsvp.responses[200].parse(await res.json());
    },
  });
}
