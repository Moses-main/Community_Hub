import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { apiRoutes } from "@/lib/api-routes";
import { buildApiUrl } from "@/lib/api-config";

export default function LogoutPage() {
  const [location, navigate] = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    const logout = async () => {
      try {
        await fetch(buildApiUrl(apiRoutes.auth.logout), {
          method: "POST",
          credentials: "include",
        });
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        // Clear all auth-related queries
        queryClient.removeQueries({ queryKey: ["/api/auth/user"] });
        queryClient.clear();
        // Force a full page reload to ensure clean state
        window.location.href = "/";
      }
    };

    logout();
  }, [navigate, queryClient]);

  return null;
}
