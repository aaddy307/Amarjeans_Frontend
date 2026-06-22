import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation, Link } from "wouter";
import { Shield, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogs() {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/admin/login" });
  
  const { data: logs = [], isLoading } = trpc.admin.getLogs.useQuery();

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
              <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground mb-1">Admin Logs</h1>
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
            <div className="col-span-3">Date</div>
            <div className="col-span-3">Action</div>
            <div className="col-span-2">Entity</div>
            <div className="col-span-4">Details</div>
          </div>
          {logs.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground font-bold uppercase tracking-widest">No logs found.</div>
          ) : (
            logs.map(log => (
              <div key={log._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-border items-center hover:bg-muted/10 transition-colors">
                <div className="md:col-span-3 text-sm font-bold text-muted-foreground">
                  {new Date(log.createdAt).toLocaleString()}
                </div>
                <div className="md:col-span-3 font-black uppercase tracking-tighter text-foreground text-sm">{log.action}</div>
                <div className="md:col-span-2 text-xs font-bold uppercase tracking-widest bg-muted/50 w-fit px-2 py-1">{log.entityType}</div>
                <div className="md:col-span-4 text-sm">{log.details || "—"}</div>
              </div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
