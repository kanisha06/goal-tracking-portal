import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { GoalsProvider } from "./contexts/GoalsContext";
import { Layout } from "./components/Layout";

// Pages
import Home from "./pages/Home";
import EmployeeDashboard from "./pages/employee/Dashboard";
import EmployeeGoals from "./pages/employee/Goals";
import EmployeeUpdates from "./pages/employee/Updates";
import ManagerDashboard from "./pages/manager/Dashboard";
import ManagerGoals from "./pages/manager/Goals";
import ManagerApprovals from "./pages/manager/Approvals";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminGoals from "./pages/admin/Goals";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      {/* Employee Routes */}
      <Route path={"/employee"} component={EmployeeDashboard} />
      <Route path={"/employee/goals"} component={EmployeeGoals} />
      <Route path={"/employee/updates"} component={EmployeeUpdates} />
      {/* Manager Routes */}
      <Route path={"/manager"} component={ManagerDashboard} />
      <Route path={"/manager/goals"} component={ManagerGoals} />
      <Route path={"/manager/approvals"} component={ManagerApprovals} />
      {/* Admin Routes */}
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/goals"} component={AdminGoals} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <GoalsProvider>
            <TooltipProvider>
              <Toaster />
              <Layout>
                <Router />
              </Layout>
            </TooltipProvider>
          </GoalsProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
