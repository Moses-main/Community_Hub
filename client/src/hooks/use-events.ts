import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Event, InsertEvent } from "@/types/api";
import { buildApiUrl } from "@/lib/api-config";
import { apiRoutes } from "@/lib/api-routes";
import { useAuth } from "@/hooks/use-auth";

export function useEvents() {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: [apiRoutes.events.list, isAuthenticated],
    queryFn: async (): Promise<(Event & { rsvpCount?: number; hasRsvped?: boolean })[]> => {
      const endpoint = isAuthenticated 
        ? "/api/events/list-with-rsvps" 
        : apiRoutes.events.list;
      const res = await fetch(buildApiUrl(endpoint), {
        credentials: isAuthenticated ? "include" : "omit",
      });
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

export function useEventWithRsvps(id: number) {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: [apiRoutes.events.get(id), "with-rsvps", isAuthenticated],
    queryFn: async () => {
      if (!isAuthenticated) {
        const res = await fetch(buildApiUrl(apiRoutes.events.get(id)));
        if (!res.ok) throw new Error("Failed to fetch event");
        return res.json();
      }
      const res = await fetch(buildApiUrl("/api/events/list-with-rsvps"), {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch events");
      const events = await res.json();
      return events.find((e: Event) => e.id === id);
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

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertEvent> }): Promise<Event> => {
      const res = await fetch(buildApiUrl(`/api/events/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update event");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiRoutes.events.list] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const res = await fetch(buildApiUrl(`/api/events/${id}`), {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete event");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiRoutes.events.list] });
    },
  });
}

export function useRsvpEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(buildApiUrl(apiRoutes.events.rsvp(id)), {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to RSVP");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-rsvps"] });
      queryClient.invalidateQueries({ queryKey: [apiRoutes.events.list] });
    },
  });
}

export function useRemoveRsvp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(buildApiUrl(apiRoutes.events.rsvp(id)), {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to remove RSVP");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-rsvps"] });
    },
  });
}

export function useUserRsvps() {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ["user-rsvps", isAuthenticated],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      const res = await fetch(buildApiUrl(apiRoutes.events.rsvps), {
        credentials: "include",
      });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: isAuthenticated,
  });
}

export function useAddToCalendar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(buildApiUrl(apiRoutes.events.addToCalendar(id)), {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to add to calendar");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-rsvps"] });
    },
  });
}
