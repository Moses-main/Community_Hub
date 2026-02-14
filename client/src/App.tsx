import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import NotFound from "@/pages/not-found";
import { HelmetProvider } from "react-helmet-async";

// Pages
import HomePage from "@/pages/HomePage";
import SermonsPage from "@/pages/SermonsPage";
import SermonDetailPage from "@/pages/SermonDetailPage";
import EventsPage from "@/pages/EventsPage";
import EventDetailPage from "@/pages/EventDetailPage";
import PrayerPage from "@/pages/PrayerPage";
import GivePage from "@/pages/GivePage";
import AuthPage from "@/pages/login"; // This is our combined auth page
import LogoutPage from "@/pages/logout";
import AuthCallbackPage from "@/pages/auth/callback";
import DashboardPage from "@/pages/DashboardPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AttendanceHistoryPage from "@/pages/AttendanceHistoryPage";
import AttendanceAnalyticsPage from "@/pages/AttendanceAnalyticsPage";
import CheckinPage from "@/pages/CheckinPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/sermons" component={SermonsPage} />
      <Route path="/sermons/:id" component={SermonDetailPage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/events/:id" component={EventDetailPage} />
      <Route path="/prayer" component={PrayerPage} />
      <Route path="/give" component={GivePage} />
      {/* Auth routes */}
      <Route path="/login" component={AuthPage} />
      <Route path="/logout" component={LogoutPage} />
      <Route path="/auth/callback" component={AuthCallbackPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/admin" component={AdminDashboardPage} />
      <Route path="/attendance" component={AttendanceHistoryPage} />
      <Route path="/attendance/analytics" component={AttendanceAnalyticsPage} />
      <Route path="/attendance/checkin" component={CheckinPage} />
      {/* Detail pages could be added here later e.g. /sermons/:id */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <div className="w-full min-h-screen">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Layout>
              <Router />
            </Layout>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </div>
    </HelmetProvider>
  );
}

export default App;
