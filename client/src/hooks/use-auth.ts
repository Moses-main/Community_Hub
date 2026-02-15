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

async function logout(): Promise<void> {
  await fetch(buildApiUrl(apiRoutes.auth.logout), {
    method: "POST",
    credentials: "include",
  });
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user", window.location.search],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    retry: false,
    onSuccess: () => {
      // Clear all auth-related queries
      queryClient.removeQueries({ queryKey: ["/api/auth/user"] });
      queryClient.clear();
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    refetch: () => queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] }),
  };
}
