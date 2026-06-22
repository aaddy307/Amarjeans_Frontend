import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Header from "./components/Header";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";
import SignIn from "./pages/SignIn";
import Contact from "./pages/Contact";
import WhatsAppButton from "./components/WhatsAppButton";
import ScrollToTop from "./components/ScrollToTop";

import AdminOrders from "./pages/AdminOrders";
import AdminLogs from "./pages/AdminLogs";
import AdminSettings from "./pages/AdminSettings";
import AdminReviews from "./pages/AdminReviews";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={About} />
      <Route path={"/products"} component={Products} />
      <Route path={"/product/:handle"} component={ProductDetail} />
      <Route path={"/cart"} component={Cart} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/login"} component={SignIn} />
      <Route path={"/admin/products"} component={AdminProducts} />
      <Route path={"/admin/categories"} component={AdminCategories} />
      <Route path={"/admin/orders"} component={AdminOrders} />
      <Route path={"/admin/reviews"} component={AdminReviews} />
      <Route path={"/admin/logs"} component={AdminLogs} />
      <Route path={"/settings"} component={AdminSettings} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout";
import { useLocation } from "wouter";

function Layout({ children }) {
  const [location] = useLocation();
  const isAdminOrSettings = (location.startsWith("/admin") && location !== "/admin/login") || location === "/settings";
  const isAuthPage = ["/admin/login"].includes(location);
  
  if (isAdminOrSettings) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <ScrollToTop />
          <Layout>
            <Router />
          </Layout>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
