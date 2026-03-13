import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { buildApiUrl } from "@/lib/api-config";

interface Member {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  birthday: string | null;
  weddingAnniversary?: string | null;
}

interface MembersResponse {
  members: Member[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Fetch all members with birthdays
async function fetchMembers(): Promise<Member[]> {
  const response = await fetch(buildApiUrl("/api/members?limit=1000"), {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch members");
  const data: MembersResponse = await response.json();
  return data.members;
}

export function useCelebrations() {
  return useQuery({
    queryKey: ["celebrations"],
    queryFn: fetchMembers,
  });
}

export function useUpcomingBirthdays(days = 30) {
  return useQuery({
    queryKey: ["celebrations", "upcoming-birthdays", days],
    queryFn: async () => {
      const members = await fetchMembers();
      const today = new Date();
      
      const withBirthdays = members.filter((m) => m.birthday);
      
      const upcoming = withBirthdays
        .map((m) => {
          if (!m.birthday) return null;
          const bday = new Date(m.birthday);
          const thisYear = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
          if (thisYear < today) thisYear.setFullYear(today.getFullYear() + 1);
          return { ...m, nextBirthday: thisYear };
        })
        .filter((m): m is Member & { nextBirthday: Date } => m !== null)
        .filter((m) => {
          const diff = (m.nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
          return diff <= days;
        })
        .sort((a, b) => a.nextBirthday.getTime() - b.nextBirthday.getTime());

      return upcoming;
    },
  });
}

export function useUpcomingAnniversaries(days = 30) {
  return useQuery({
    queryKey: ["celebrations", "upcoming-anniversaries", days],
    queryFn: async () => {
      const members = await fetchMembers();
      const today = new Date();
      
      // Filter members that have wedding anniversary data
      // Note: weddingAnniversary field doesn't exist in current schema
      // This will return empty array until the field is added
      const withAnniversaries = members.filter((m) => m.weddingAnniversary);
      
      const upcoming = withAnniversaries
        .map((m) => {
          if (!m.weddingAnniversary) return null;
          const ann = new Date(m.weddingAnniversary);
          const thisYear = new Date(today.getFullYear(), ann.getMonth(), ann.getDate());
          if (thisYear < today) thisYear.setFullYear(today.getFullYear() + 1);
          return { ...m, nextAnniversary: thisYear };
        })
        .filter((m): m is Member & { nextAnniversary: Date } => m !== null)
        .filter((m) => {
          const diff = (m.nextAnniversary.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
          return diff <= days;
        })
        .sort((a, b) => a.nextAnniversary.getTime() - b.nextAnniversary.getTime());

      return upcoming;
    },
  });
}

export function useTodaysCelebrations() {
  return useQuery({
    queryKey: ["celebrations", "today"],
    queryFn: async () => {
      const members = await fetchMembers();
      const today = new Date();
      const month = today.getMonth();
      const day = today.getDate();

      const birthdays = members.filter((m) => {
        if (!m.birthday) return false;
        const bd = new Date(m.birthday);
        return bd.getMonth() === month && bd.getDate() === day;
      });

      const anniversaries = members.filter((m) => {
        if (!m.weddingAnniversary) return false;
        const ann = new Date(m.weddingAnniversary);
        return ann.getMonth() === month && ann.getDate() === day;
      });

      // Map to match expected format with first_name/last_name for compatibility
      return {
        birthdays: birthdays.map(m => ({
          ...m,
          first_name: m.firstName,
          last_name: m.lastName,
        })),
        anniversaries: anniversaries.map(m => ({
          ...m,
          first_name: m.firstName,
          last_name: m.lastName,
        })),
      };
    },
  });
}

// Note: These mutations would require backend endpoints for greetings
// For now, they're placeholders that could be implemented later
export function useSendGreeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (greeting: { celebration_id: string; type: string; message: string }) => {
      // TODO: Implement backend endpoint for greetings
      // For now, just invalidate and return success
      console.log("Greeting would be sent:", greeting);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["greetings"] });
    },
  });
}

export function useAddCelebration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (member: { 
      user_id?: string;
      first_name: string; 
      last_name?: string | null; 
      email?: string | null;
      phone?: string | null;
      birthday?: string | null;
      wedding_anniversary?: string | null;
    }) => {
      // This would require a new user registration or profile update endpoint
      // For now, we invalidate the members list
      console.log("Would add member:", member);
      queryClient.invalidateQueries({ queryKey: ["celebrations"] });
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["celebrations"] });
    },
  });
}

export function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  const next = new Date(today.getFullYear(), d.getMonth(), d.getDate());
  if (next < today) next.setFullYear(today.getFullYear() + 1);
  return Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function getAge(dateStr: string): number {
  const today = new Date();
  const d = new Date(dateStr);
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age;
}
