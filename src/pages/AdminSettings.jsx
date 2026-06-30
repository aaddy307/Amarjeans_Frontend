import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation, Link } from "wouter";
import { Shield, ArrowLeft, Save } from "lucide-react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function AdminSettings() {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/admin/login" });
  
  const utils = trpc.useUtils();
  const { data: settings, isLoading } = trpc.admin.getSettings.useQuery();
  
  const [formData, setFormData] = useState({
    storeName: "",
    supportEmail: "",
    supportPhone: "",
    storeAddress: "",
    instagramUrl: "",
    whatsappNumber: ""
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        storeName: settings.storeName || "",
        supportEmail: settings.supportEmail || "",
        supportPhone: settings.supportPhone || "",
        storeAddress: settings.storeAddress || "",
        instagramUrl: settings.instagramUrl || "",
        whatsappNumber: settings.whatsappNumber || ""
      });
    }
  }, [settings]);

  const updateMutation = trpc.admin.updateSettings.useMutation({
    onSuccess: () => {
      toast.success("Settings updated successfully!");
      utils.admin.getSettings.invalidate();
      utils.commerce.settings.get.invalidate();
    },
    onError: (err) => toast.error(err.message)
  });

  if (authLoading || isLoading) return null;
  if (!user || user.role !== "admin") {
    setLocation("/");
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <motion.div
        className="bg-background border-b border-border py-8 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground mb-1">Site Settings</h1>
              <Link href="/admin">
                <span className="text-primary font-bold uppercase tracking-widest text-xs flex items-center gap-1 cursor-pointer hover:underline">
                  <ArrowLeft className="w-3 h-3" /> Back to Dashboard
                </span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-background border border-border p-8"
        >
          <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground mb-6 pb-4 border-b border-border">General Settings</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">Store Name</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary font-bold"
                required
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">Support Email</label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={e => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary font-bold"
                required
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">Support Phone</label>
              <input
                type="text"
                value={formData.supportPhone}
                onChange={e => setFormData({ ...formData, supportPhone: e.target.value })}
                className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary font-bold"
                required
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">Store Address</label>
              <textarea
                value={formData.storeAddress}
                onChange={e => setFormData({ ...formData, storeAddress: e.target.value })}
                className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary font-bold resize-none"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">Instagram URL</label>
              <input
                type="url"
                value={formData.instagramUrl}
                onChange={e => setFormData({ ...formData, instagramUrl: e.target.value })}
                className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">WhatsApp Number (e.g. 919834557990)</label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary font-bold"
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={updateMutation.isPending}
              className="w-full bg-foreground text-background font-black uppercase tracking-widest py-4 hover:bg-primary transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-8"
            >
              {updateMutation.isPending ? "Saving..." : <><Save className="w-5 h-5" /> Save Settings</>}
            </button>
          </form>

        </motion.div>
      </div>
    </div>
  );
}
