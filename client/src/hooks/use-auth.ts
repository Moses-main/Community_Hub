import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/types/api";
import { buildApiUrl } from "@/lib/api-config";
import { apiRoutes } from "@/lib/api-routes";

async function fetchUser(): Promise<User | null> {
  const response = await fetch(buildApiUrl(apiRoutes.auth.user), {
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["auth", "user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      queryClient.setQueryData(["auth", "user"], null);
      try {
        await fetch(buildApiUrl(apiRoutes.auth.logout), {
          method: "POST",
          credentials: "include",
        });
      } catch (error) {
        console.error("Logout error:", error);
      }
      queryClient.clear();
    },
    retry: false,
    onSuccess: () => {
      window.location.href = "/login";
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    refetch: () => queryClient.invalidateQueries({ queryKey: ["auth", "user"] }),
  };
}
