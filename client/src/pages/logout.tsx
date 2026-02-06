import { useEffect } from "react";
import { useLocation } from "wouter";
import { apiRoutes } from "@/lib/api-routes";
import { buildApiUrl } from "@/lib/api-config";

export default function LogoutPage() {
  const [location, navigate] = useLocation();

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
        navigate("/");
      }
    };

    logout();
  }, [router]);

  return null;
}