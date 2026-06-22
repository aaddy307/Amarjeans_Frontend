import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { BarChart3, Users, ShoppingBag, TrendingUp, LogOut, Activity, Settings, Shield, Tags, PackagePlus } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";

const counterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 120 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { user, loading, logout } = useAuth({ 
    redirectOnUnauthenticated: true, 
    redirectPath: "/signin" 
  });
  const { data: dashboard, isLoading } = trpc.admin.getDashboard.useQuery(undefined, {
    enabled: !!user && user.role === "admin"
  });

  useEffect(() => {
    if (!loading && user && user.role !== "admin") {
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div 
          className="w-16 h-16 border-4 border-foreground border-t-transparent rounded-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  const stats = [
    { label: "Total Orders", value: dashboard?.totalOrders || 0, icon: ShoppingBag, suffix: "" },
    { label: "Total Revenue", value: dashboard?.totalRevenue != null ? dashboard.totalRevenue.toFixed(0) : "0", icon: TrendingUp, prefix: "₹", suffix: "" },
    { label: "Total Users", value: dashboard?.totalUsers || 0, icon: Users, suffix: "" },
    { label: "Total Products", value: dashboard?.totalProducts || 0, icon: PackagePlus, suffix: "" },
  ];

  const controls = [
    { href: "/admin/products", icon: PackagePlus, title: "Manage Products", desc: "Add, edit, or remove products" },
    { href: "/admin/categories", icon: Tags, title: "Manage Categories", desc: "Create and update store categories" },
    { href: "/admin/orders", icon: ShoppingBag, title: "Manage Orders", desc: "View and update order statuses" },
    { href: "/admin/users", icon: Users, title: "Manage Users", desc: "Update roles and manage accounts" },
    { href: "/admin/logs", icon: Activity, title: "Admin Logs", desc: "View all admin activities" },
    { href: "/settings", icon: Settings, title: "Site Settings", desc: "Configure your store" },
  ];

  return (
    <div className="min-h-screen bg-muted/20">


      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants} initial="hidden" animate="visible"
          >
            {stats.map(({ label, value, icon: Icon, prefix = "", suffix }, i) => (
              <motion.div
                key={i}
                variants={counterVariants}
                className="bg-background border border-border p-6 flex flex-col relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-muted/30 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500" />
                <div className="flex items-start justify-between mb-4">
                  <p className="text-muted-foreground text-xs font-black uppercase tracking-widest">{label}</p>
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <motion.p
                  className="text-4xl font-black text-foreground uppercase tracking-tighter mt-auto"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
                >
                  {isLoading ? "—" : `${prefix}${value}${suffix}`}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>

          {/* Control Cards */}
          <div>
            <motion.h2 className="text-2xl font-black uppercase tracking-tighter text-foreground mb-6 border-b border-border pb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              System Controls
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants} initial="hidden" animate="visible"
            >
              {controls.map(({ href, icon: Icon, title, desc }) => (
                <motion.div key={href} variants={cardVariants}>
                  <Link href={href}>
                    <div className="bg-background border border-border p-6 cursor-pointer group hover:border-foreground transition-colors h-full flex flex-col">
                      <div className="w-12 h-12 bg-muted/30 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-black uppercase tracking-tighter text-foreground mb-2">{title}</h3>
                      <p className="text-muted-foreground text-xs font-bold leading-relaxed">{desc}</p>
                      <div className="mt-auto pt-6 text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                        Access <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Recent Orders */}
          {dashboard?.recentOrders?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground mb-6 border-b border-border pb-4">Recent Orders</h2>
              <div className="bg-background border border-border overflow-hidden">
                {dashboard.recentOrders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.05 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 border-b border-border last:border-0 hover:bg-muted/10 transition-colors gap-4"
                  >
                    <div>
                      <p className="text-foreground font-black uppercase tracking-tighter text-lg">Order #{order.orderNumber}</p>
                      <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <span className="text-foreground font-black text-xl">₹{order.totalPrice}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 ${
                        order.status === "delivered" ? "bg-green-100 text-green-700" :
                        order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                        order.status === "cancelled" ? "bg-red-100 text-red-700" :
                        "bg-orange-100 text-orange-700"
                      }`}>{order.status}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
