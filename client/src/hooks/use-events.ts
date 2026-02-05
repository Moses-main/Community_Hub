import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Event, InsertEvent } from "@/types/api";
import { buildApiUrl } from "@/lib/api-config";
import { apiRoutes } from "@/lib/api-routes";

export function useEvents() {
  return useQuery({
    queryKey: [apiRoutes.events.list],
    queryFn: async (): Promise<Event[]> => {
      const res = await fetch(buildApiUrl(apiRoutes.events.list));
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
  });
}

export function useEvent(id: number) {
  return useQuery({
    queryKey: [apiRoutes.events.get(id)],
    queryFn: async (): Promise<Event> => {
      const res = await fetch(buildApiUrl(apiRoutes.events.get(id)));
      if (!res.ok) throw new Error("Failed to fetch event");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertEvent): Promise<Event> => {
      const res = await fetch(buildApiUrl(apiRoutes.events.create), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create event");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiRoutes.events.list] });
    },
  });
}

export function useRsvpEvent() {
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(buildApiUrl(apiRoutes.events.rsvp(id)), {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to RSVP");
      return res.json();
    },
  });
}
