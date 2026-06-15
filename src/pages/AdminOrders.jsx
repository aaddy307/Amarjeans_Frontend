import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation, Link } from "wouter";
import { Shield, Trash2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function AdminOrders() {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/signin" });
  
  const utils = trpc.useUtils();
  const { data: orders = [], isLoading } = trpc.admin.getOrders.useQuery();

  const updateStatusMutation = trpc.admin.updateOrderStatus.useMutation({
    onSuccess: () => {
      toast.success("Order status updated");
      utils.admin.getOrders.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  if (loading || isLoading) return null;
  if (!user || user.role !== "admin") {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <motion.div
        className="bg-background border-b border-border py-8 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground mb-1">Manage Orders</h1>
              <Link href="/admin">
                <span className="text-primary font-bold uppercase tracking-widest text-xs flex items-center gap-1 cursor-pointer hover:underline">
                  <ArrowLeft className="w-3 h-3" /> Back to Dashboard
                </span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-background border border-border"
        >
          <div className="grid-cols-12 gap-4 p-4 border-b border-border text-xs font-black uppercase tracking-widest text-muted-foreground bg-muted/20 hidden md:grid">
            <div className="col-span-3">Order ID</div>
            <div className="col-span-3">Date</div>
            <div className="col-span-2">Total</div>
            <div className="col-span-4 text-right">Status / Act</div>
          </div>
          {orders.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground font-bold uppercase tracking-widest">No orders found.</div>
          ) : (
            orders.map(order => (
              <div key={order._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-border items-center hover:bg-muted/10 transition-colors">
                <div className="md:col-span-3 font-black uppercase tracking-tighter text-foreground">{order.orderNumber}</div>
                <div className="md:col-span-3 text-sm font-bold text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div className="md:col-span-2 font-black text-lg">
                  ₹{order.totalPrice}
                </div>
                <div className="md:col-span-4 flex justify-end items-center gap-4">
                  <select 
                    value={order.status}
                    onChange={(e) => updateStatusMutation.mutate({ orderId: order._id, status: e.target.value })}
                    className="bg-muted/30 border border-border px-3 py-2 text-xs font-bold uppercase tracking-widest cursor-pointer focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
