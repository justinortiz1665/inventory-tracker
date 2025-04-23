import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Inventory from "@/pages/inventory";
import Facilities from "@/pages/facilities";
import FacilityDetail from "@/pages/facility-detail";
import Transactions from "@/pages/transactions";
import Reports from "@/pages/reports";
import AppShell from "@/components/layout/app-shell";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard}/>
      <Route path="/inventory" component={Inventory}/>
      <Route path="/facilities" component={Facilities}/>
      <Route path="/facilities/:id" component={FacilityDetail}/>
      <Route path="/transactions" component={Transactions}/>
      <Route path="/reports" component={Reports}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppShell>
          <Router />
        </AppShell>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
