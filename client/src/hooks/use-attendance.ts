import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { buildApiUrl } from "@/lib/api-config";

export interface Attendance {
  id: number;
  userId: string | null;
  serviceType: "SUNDAY_SERVICE" | "MIDWEEK_SERVICE" | "SPECIAL_EVENT" | "ONLINE_LIVE" | "ONLINE_REPLAY";
  serviceId: number | null;
  serviceName: string;
  serviceDate: string;
  attendanceType: "SELF_CHECKIN" | "MANUAL" | "ONLINE_AUTO" | "QR_CHECKIN";
  checkInTime: string | null;
  watchDuration: number | null;
  isOnline: boolean;
  notes: string | null;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
}

export interface AttendanceLink {
  id: number;
  serviceType: string;
  serviceId: number | null;
  serviceName: string;
  serviceDate: string;
  uniqueToken: string;
  qrCodeUrl: string;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  createdBy: string | null;
  checkinUrl?: string;
}

export interface AttendanceStats {
  total: number;
  online: number;
  offline: number;
  byService: { serviceType: string; count: number }[];
}

export interface AttendanceCheckinInput {
  serviceType: string;
  serviceId?: number;
  serviceName: string;
  serviceDate: string;
  notes?: string;
}

export interface AttendanceManualCheckinInput {
  targetUserId: string;
  serviceType: string;
  serviceId?: number;
  serviceName: string;
  serviceDate: string;
  notes?: string;
}

export interface AttendanceLinkInput {
  serviceType: string;
  serviceId?: number;
  serviceName: string;
  serviceDate: string;
  expiresAt?: string;
}

export function useAttendance() {
  return useQuery<Attendance[]>({
    queryKey: ["attendance"],
    queryFn: async (): Promise<Attendance[]> => {
      const res = await fetch(buildApiUrl("/api/attendance/me"), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch attendance");
      return res.json();
    },
  });
}

export function useAttendanceStats(startDate: string, endDate: string, serviceType?: string) {
  return useQuery<AttendanceStats>({
    queryKey: ["attendance-stats", startDate, endDate, serviceType],
    queryFn: async (): Promise<AttendanceStats> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        const params = new URLSearchParams({ startDate, endDate });
        if (serviceType) params.append("serviceType", serviceType);
        const res = await fetch(buildApiUrl(`/api/attendance/analytics?${params}`), { 
          credentials: "include",
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          const error = await res.json().catch(() => ({ message: "Failed to fetch attendance stats" }));
          throw new Error(error.message || "Failed to fetch attendance stats");
        }
        return res.json();
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (err.name === "AbortError") {
          throw new Error("Request timed out");
        }
        throw err;
      }
    },
    enabled: !!startDate && !!endDate,
  });
}

export function useAttendanceForService(serviceType: string, serviceDate: string) {
  return useQuery<Attendance[]>({
    queryKey: ["attendance-service", serviceType, serviceDate],
    queryFn: async (): Promise<Attendance[]> => {
      const params = new URLSearchParams({ serviceType, serviceDate });
      const res = await fetch(buildApiUrl(`/api/attendance/service?${params}`), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch service attendance");
      return res.json();
    },
    enabled: !!serviceType && !!serviceDate,
  });
}

export function useAttendanceLink(token: string) {
  return useQuery<AttendanceLink>({
    queryKey: ["attendance-link", token],
    queryFn: async (): Promise<AttendanceLink> => {
      const res = await fetch(buildApiUrl(`/api/attendance/links/${token}`));
      if (!res.ok) throw new Error("Failed to fetch attendance link");
      return res.json();
    },
    enabled: !!token,
  });
}

export function useCreateAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AttendanceCheckinInput): Promise<Attendance> => {
      const res = await fetch(buildApiUrl("/api/attendance/checkin"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Failed to check in" }));
        throw new Error(error.message || "Failed to check in");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}

export function useManualCheckin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AttendanceManualCheckinInput): Promise<Attendance> => {
      const res = await fetch(buildApiUrl("/api/attendance/manual"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to check in");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}

export function useCreateAttendanceLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AttendanceLinkInput): Promise<AttendanceLink> => {
      const res = await fetch(buildApiUrl("/api/attendance/links"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create attendance link");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance-links"] });
    },
  });
}

export function useCheckinWithLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ token, notes }: { token: string; notes?: string }): Promise<Attendance> => {
      const res = await fetch(buildApiUrl(`/api/attendance/links/${token}/checkin`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to check in");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}

export function useRecordOnlineAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      userId: string;
      serviceType: string;
      serviceId?: number;
      serviceName: string;
      serviceDate: string;
      watchDuration: number;
      isReplay?: boolean;
    }) => {
      const res = await fetch(buildApiUrl("/api/attendance/online"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to record online attendance");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}

export function useAttendanceSettings() {
  return useQuery({
    queryKey: ["attendance-settings"],
    queryFn: async () => {
      const res = await fetch(buildApiUrl("/api/attendance/settings"), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch attendance settings");
      return res.json();
    },
  });
}

export function useUpdateAttendanceSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      onlineWatchThresholdMinutes?: number;
      enableOnlineDetection?: boolean;
      enableSelfCheckin?: boolean;
      enableQrCheckin?: boolean;
    }) => {
      const res = await fetch(buildApiUrl("/api/attendance/settings"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update settings");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance-settings"] });
    },
  });
}

export interface AbsentMember {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  missedCount: number;
  lastAttendance: string | null;
  lastServiceDate: string | null;
}

export function useAbsentMembers(consecutiveMissed: number = 3) {
  return useQuery<AbsentMember[]>({
    queryKey: ["absent-members", consecutiveMissed],
    queryFn: async (): Promise<AbsentMember[]> => {
      const res = await fetch(
        buildApiUrl(`/api/attendance/absent?consecutiveMissed=${consecutiveMissed}`),
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to fetch absent members");
      return res.json();
    },
  });
}
