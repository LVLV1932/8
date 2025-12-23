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
import LoginNew from "@/pages/login-new";
import Admin from "@/pages/admin";
import Articles from "@/pages/articles";
import Signup from "@/pages/signup";
import StudentDashboard from "@/pages/student-dashboard";
import StudentQA from "@/pages/student-qa";
import MainPortal from "@/pages/main-portal";
import StudentPortal from "@/pages/student-portal";
import TeacherPortal from "@/pages/teacher-portal";
import Register from "@/pages/register";
import Pending from "@/pages/pending";
import ArticleDetail from "@/pages/article-detail";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/programs" component={Programs} />
      <Route path="/teachers" component={Teachers} />
      <Route path="/articles" component={Articles} />
      <Route path="/article-detail" component={ArticleDetail} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/login-new" component={LoginNew} />
      <Route path="/register" component={Register} />
      <Route path="/pending" component={Pending} />
      <Route path="/admin" component={Admin} />
      <Route path="/signup" component={Signup} />
      <Route path="/student-dashboard" component={StudentDashboard} />
      <Route path="/student-qa" component={StudentQA} />
      <Route path="/portal" component={MainPortal} />
      <Route path="/student-portal" component={StudentPortal} />
      <Route path="/teacher-portal" component={TeacherPortal} />
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
