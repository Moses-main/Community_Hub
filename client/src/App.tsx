import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import NotFound from "@/pages/not-found";

// Pages
import HomePage from "@/pages/HomePage";
import SermonsPage from "@/pages/SermonsPage";
import EventsPage from "@/pages/EventsPage";
import PrayerPage from "@/pages/PrayerPage";
import GivePage from "@/pages/GivePage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/sermons" component={SermonsPage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/prayer" component={PrayerPage} />
      <Route path="/give" component={GivePage} />
      {/* Detail pages could be added here later e.g. /sermons/:id */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Layout>
          <Router />
        </Layout>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
