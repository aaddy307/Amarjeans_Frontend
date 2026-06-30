import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { BarChart3, Users, ShoppingBag, Activity, Settings, Shield, Tags, PackagePlus, X, LogOut, Menu, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminLayout({ children }) {
  const [location, setLocation] = useLocation();
  const { user, logout, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      if (location !== "/admin/login") {
        setLocation("/admin/login");
      }
    }
  }, [user, loading, location, setLocation]);

  const navLinks = [
    { href: "/admin", icon: BarChart3, label: "Dashboard" },
    { href: "/admin/products", icon: PackagePlus, label: "Products" },
    { href: "/admin/categories", icon: Tags, label: "Categories" },
    { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
    { href: "/admin/reviews", icon: MessageSquare, label: "Reviews" },
    { href: "/admin/logs", icon: Activity, label: "Logs" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="flex h-screen bg-muted/10 overflow-hidden font-sans selection:bg-primary selection:text-primary-foreground">
      
      {/* Mobile Header / Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-black uppercase tracking-tighter text-foreground">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          {!mobileMenuOpen && (
            <button onClick={() => setLocation("/")} className="text-muted-foreground hover:text-foreground">
              <X className="w-6 h-6" />
            </button>
          )}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-foreground">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed lg:static top-16 left-0 bottom-0 z-40 w-64 bg-background border-r border-border flex flex-col transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="hidden lg:flex p-6 border-b border-border items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <img src="/image.png" alt="AMAR JEANS" className="h-11 object-contain mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Admin Portal</span>
            </div>
          </div>
          {/* Back to Site Cross */}
          <button onClick={() => setLocation("/")} className="text-muted-foreground hover:text-destructive transition-colors p-1" title="Back to Store">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-border bg-muted/20">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Logged In As</p>
          <p className="text-sm font-black text-foreground truncate">{user.name}</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 custom-scrollbar">
          {navLinks.map((link) => {
            const isActive = location === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                    isActive 
                      ? "bg-foreground text-background" 
                      : "text-foreground hover:bg-muted/50"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-destructive hover:bg-destructive hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className={`flex-1 w-full pt-16 lg:pt-0 ${mobileMenuOpen ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        <div className="min-h-full">
          {children}
        </div>
      </main>

    </div>
  );
}
