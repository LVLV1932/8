import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SchoolProvider } from "@/lib/store";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import About from "@/pages/about";
import Programs from "@/pages/programs";
import Teachers from "@/pages/teachers";
import Contact from "@/pages/contact";
import Login from "@/pages/login";
import Admin from "@/pages/admin";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/programs" component={Programs} />
      <Route path="/teachers" component={Teachers} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SchoolProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </SchoolProvider>
    </QueryClientProvider>
  );
}

export default App;
