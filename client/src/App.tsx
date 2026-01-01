import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import BackOfficeDashboard from "@/pages/backoffice-dashboard";
import ProductsManagement from "@/pages/backoffice-products";
import CategoriesManagement from "@/pages/backoffice-categories";
import OrdersManagement from "@/pages/backoffice-orders";
import CustomersManagement from "@/pages/backoffice-customers";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/backoffice" component={BackOfficeDashboard} />
      <ProtectedRoute path="/backoffice/products" component={ProductsManagement} />
      <ProtectedRoute path="/backoffice/categories" component={CategoriesManagement} />
      <ProtectedRoute path="/backoffice/orders" component={OrdersManagement} />
      <ProtectedRoute path="/backoffice/customers" component={CustomersManagement} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
