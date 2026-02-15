import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { buildApiUrl } from "@/lib/api-config";

export interface MemberMessage {
  id: number;
  userId: string | null;
  type: "ABSENCE_ALERT" | "GENERAL" | "PASTORAL" | "ANNOUNCEMENT";
  title: string;
  content: string;
  isRead: boolean;
  readAt: string | null;
  priority: "high" | "normal" | "low";
  createdBy: string | null;
  replyToId: number | null;
  senderId: string | null;
  createdAt: string;
}

export function useMyMessages() {
  return useQuery<MemberMessage[]>({
    queryKey: ["my-messages"],
    queryFn: async (): Promise<MemberMessage[]> => {
      const res = await fetch(buildApiUrl("/api/messages/me"), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
  });
}

export function useUnreadCount() {
  return useQuery<{ count: number }>({
    queryKey: ["unread-count"],
    queryFn: async (): Promise<{ count: number }> => {
      const res = await fetch(buildApiUrl("/api/messages/unread-count"), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch unread count");
      return res.json();
    },
    refetchInterval: 30000, // Check every 30 seconds
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      userId: string;
      type: string;
      title: string;
      content: string;
      priority?: string;
    }): Promise<MemberMessage> => {
      const res = await fetch(buildApiUrl("/api/messages/send"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Failed to send message" }));
        throw new Error(error.message || "Failed to send message");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-messages"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
      queryClient.invalidateQueries({ queryKey: ["absent-members"] });
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (messageId: number): Promise<void> => {
      const res = await fetch(buildApiUrl(`/api/messages/${messageId}/read`), {
        method: "PUT",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to mark as read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-messages"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });
}

export function useReplyToMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { messageId: number; content: string }): Promise<MemberMessage> => {
      const res = await fetch(buildApiUrl(`/api/messages/${data.messageId}/reply`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: data.content }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to reply");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-messages"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });
}

export function useMessageThread(messageId: number | null) {
  return useQuery<MemberMessage[]>({
    queryKey: ["message-thread", messageId],
    queryFn: async (): Promise<MemberMessage[]> => {
      if (!messageId) return [];
      const res = await fetch(buildApiUrl(`/api/messages/${messageId}/thread`), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch thread");
      return res.json();
    },
    enabled: !!messageId,
  });
}
