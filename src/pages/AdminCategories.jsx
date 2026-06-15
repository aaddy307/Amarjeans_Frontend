import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Shield, Plus, Trash2, ArrowLeft, Image as ImageIcon, Upload, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Link } from "wouter";

export default function AdminCategories() {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/signin" });
  
  const [view, setView] = useState("list"); // "list" or "form"
  const [isUploading, setIsUploading] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const fileInputRef = useRef(null);
  const utils = trpc.useUtils();
  const { data: categories = [], isLoading } = trpc.commerce.categories.list.useQuery();

  const createMutation = trpc.admin.createCategory.useMutation({
    onSuccess: () => {
      toast.success("Category created successfully!");
      resetForm();
      setView("list");
      utils.commerce.categories.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.admin.deleteCategory.useMutation({
    onSuccess: () => {
      toast.success("Category deleted");
      utils.commerce.categories.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const resetForm = () => {
    setName("");
    setSlug("");
    setImageFile(null);
    setImagePreview("");
  };

  if (loading || isLoading) return null;
  if (!user || user.role !== "admin") {
    setLocation("/");
    return null;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    let uploadedImageUrl = undefined;

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to upload image");
        uploadedImageUrl = data.url;
      } catch (err) {
        toast.error(err.message);
        setIsUploading(false);
        return;
      }
    }

    createMutation.mutate({ 
      name, 
      slug, 
      image: uploadedImageUrl 
    }, {
      onSettled: () => setIsUploading(false)
    });
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
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground mb-1">Manage Categories</h1>
              <Link href="/admin">
                <span className="text-primary font-bold uppercase tracking-widest text-xs flex items-center gap-1 cursor-pointer hover:underline">
                  <ArrowLeft className="w-3 h-3" /> Back to Dashboard
                </span>
              </Link>
            </div>
          </div>
          {view === "list" ? (
            <button 
              onClick={() => setView("form")}
              className="bg-foreground text-background font-black uppercase tracking-widest px-6 py-3 flex items-center gap-2 hover:bg-primary transition-colors text-sm"
            >
              <Plus className="w-5 h-5" /> Add Category
            </button>
          ) : (
            <button 
              onClick={() => { setView("list"); resetForm(); }}
              className="border-2 border-foreground text-foreground font-black uppercase tracking-widest px-6 py-3 flex items-center gap-2 hover:bg-muted transition-colors text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {view === "list" ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-background border border-border"
            >
              <div className="grid-cols-12 gap-4 p-4 border-b border-border text-xs font-black uppercase tracking-widest text-muted-foreground bg-muted/20 hidden md:grid">
                <div className="col-span-2">Image</div>
                <div className="col-span-4">Name</div>
                <div className="col-span-4">Slug</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              {categories.length === 0 ? (
                <div className="p-16 text-center text-muted-foreground font-bold uppercase tracking-widest">No categories found. Add one above.</div>
              ) : (
                categories.map(cat => (
                  <div key={cat.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-border items-center hover:bg-muted/10 transition-colors">
                    <div className="md:col-span-2 hidden md:block">
                      <div className="w-16 h-16 bg-muted border border-border overflow-hidden flex items-center justify-center">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-4 font-black uppercase tracking-tighter text-foreground text-lg">{cat.name}</div>
                    <div className="md:col-span-4 text-sm font-bold text-muted-foreground">{cat.slug}</div>
                    <div className="md:col-span-2 text-right flex justify-end">
                      <button 
                        onClick={() => {
                          if (confirm("Are you sure? This cannot be undone.")) {
                            deleteMutation.mutate({ categoryId: cat.id });
                          }
                        }}
                        className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors border border-transparent hover:border-destructive/20"
                        title="Delete Category"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="form"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="max-w-2xl mx-auto bg-background border border-border p-8"
            >
              <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground mb-8 pb-4 border-b border-border">Create New Category</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">Category Name</label>
                  <input 
                    type="text" value={name} 
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                      }
                    }}
                    required
                    className="w-full bg-muted/30 border border-border px-4 py-4 text-sm focus:outline-none focus:border-primary transition-colors" 
                    placeholder="e.g. Winter Jackets"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">URL Slug</label>
                  <input 
                    type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required
                    className="w-full bg-muted/30 border border-border px-4 py-4 text-sm focus:outline-none focus:border-primary transition-colors lowercase" 
                    placeholder="e.g. winter-jackets"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">Category Image (Optional)</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full h-48 border-2 border-dashed ${imagePreview ? "border-primary" : "border-border hover:border-primary"} bg-muted/20 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden group`}
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="font-bold uppercase tracking-widest text-sm flex items-center gap-2"><Upload className="w-4 h-4"/> Change Image</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6">
                        <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                        <p className="text-foreground font-bold uppercase tracking-widest text-sm mb-1">Upload Image</p>
                        <p className="text-muted-foreground text-xs">JPG, PNG, WebP up to 5MB</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  {imagePreview && (
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(""); }}
                      className="mt-2 text-xs font-bold uppercase tracking-widest text-destructive hover:underline flex items-center gap-1"
                    >
                      <X className="w-3 h-3"/> Remove Image
                    </button>
                  )}
                </div>

                <div className="pt-8 border-t border-border flex justify-end">
                  <button 
                    type="submit" disabled={createMutation.isPending || isUploading}
                    className="bg-foreground text-background font-black uppercase tracking-widest px-12 py-5 flex items-center justify-center gap-3 hover:bg-primary transition-colors disabled:opacity-50 text-lg w-full"
                  >
                    {createMutation.isPending || isUploading ? (
                      <motion.div className="w-6 h-6 border-2 border-background border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                    ) : <>Publish Category</>}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
