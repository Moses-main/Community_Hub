import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { buildApiUrl } from "@/lib/api-config";

interface BrandingColors {
  primary: string;
  secondary: string;
  accent: string;
}

interface BrandingFonts {
  heading: string;
  body: string;
}

export interface Branding {
  id: number;
  colors: BrandingColors;
  logoUrl: string | null;
  fonts: BrandingFonts;
}

export function useBranding() {
  return useQuery({
    queryKey: ["/api/branding"],
    queryFn: async (): Promise<Branding> => {
      const res = await fetch(buildApiUrl("/api/branding"));
      if (!res.ok) throw new Error("Failed to fetch branding");
      return res.json();
    },
  });
}

export function useUpdateBranding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Branding>): Promise<Branding> => {
      const res = await fetch(buildApiUrl("/api/branding"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update branding");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/branding"] });
    },
  });
}
