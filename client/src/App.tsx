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
import EventsPage from "@/pages/EventsPage";
import PrayerPage from "@/pages/PrayerPage";
import GivePage from "@/pages/GivePage";
import AuthPage from "@/pages/login"; // This is our combined auth page
import LogoutPage from "@/pages/logout";
import AuthCallbackPage from "@/pages/auth/callback";
import DashboardPage from "@/pages/DashboardPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/sermons" component={SermonsPage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/prayer" component={PrayerPage} />
      <Route path="/give" component={GivePage} />
      {/* Auth routes */}
      <Route path="/login" component={AuthPage} />
      <Route path="/logout" component={LogoutPage} />
      <Route path="/auth/callback" component={AuthCallbackPage} />
      <Route path="/dashboard" component={DashboardPage} />
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
