import { useState } from "react";
import { useAttendanceStats } from "@/hooks/use-attendance";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Video, 
  MapPin, 
  Loader2, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from "lucide-react";

const serviceTypeLabels: Record<string, string> = {
  SUNDAY_SERVICE: "Sunday Service",
  MIDWEEK_SERVICE: "Midweek Service",
  SPECIAL_EVENT: "Special Event",
  ONLINE_LIVE: "Online Live",
  ONLINE_REPLAY: "Online Replay",
};

export default function AttendanceAnalyticsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [dateRange, setDateRange] = useState<"week" | "month" | "quarter">("month");
  
  const now = new Date();
  let startDate: Date;
  let endDate = now;

  switch (dateRange) {
    case "week":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "month":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "quarter":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
  }

  const { data: stats, isLoading, error } = useAttendanceStats(
    startDate.toISOString(),
    endDate.toISOString()
  );

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              You don&apos;t have permission to view this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>Failed to load attendance analytics. Please try again.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const maxCount = Math.max(...(stats?.byService.map(s => s.count) || [0]), 1);

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track engagement and growth
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={dateRange === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange("week")}
          >
            Week
          </Button>
          <Button
            variant={dateRange === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange("month")}
          >
            Month
          </Button>
          <Button
            variant={dateRange === "quarter" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange("quarter")}
          >
            Quarter
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Person</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.offline || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.total ? Math.round((stats.offline / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.online || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.total ? Math.round((stats.online / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg per Service</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.byService?.length ? Math.round(stats.total / stats.byService.length) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Attendance by Service Type</CardTitle>
          <CardDescription>
            {startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.byService?.map((service) => (
              <div key={service.serviceType} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {serviceTypeLabels[service.serviceType] || service.serviceType}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {service.count} ({stats.total ? Math.round((service.count / stats.total) * 100) : 0}%)
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(service.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {(!stats?.byService || stats.byService.length === 0) && (
              <p className="text-center text-muted-foreground py-8">
                No attendance data for this period.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
          <CardDescription>Summary for the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Services Tracked</p>
                <p className="text-2xl font-bold">{stats?.byService?.length || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
              <Video className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Online Engagement</p>
                <p className="text-2xl font-bold">{stats?.online || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
              <MapPin className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">In-Person Attendance</p>
                <p className="text-2xl font-bold">{stats?.offline || 0}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
