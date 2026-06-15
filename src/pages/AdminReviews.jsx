import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation, Link } from "wouter";
import { Shield, Trash2, ArrowLeft, Plus, X, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

export default function AdminReviews() {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: "/signin",
  });

  const utils = trpc.useUtils();
  const { data: reviews = [], isLoading } =
    trpc.admin.getRecentReviews.useQuery();
  const { data: products = [] } = trpc.commerce.products.list.useQuery();

  const [isAdding, setIsAdding] = useState(false);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [newReview, setNewReview] = useState({
    productId: "",
    authorName: "",
    rating: 5,
    comment: "",
  });
  const [autoGenProductId, setAutoGenProductId] = useState("");
  const [editingReview, setEditingReview] = useState(null);

  const deleteMutation = trpc.admin.deleteReview.useMutation({
    onSuccess: () => {
      toast.success("Review deleted");
      utils.admin.getRecentReviews.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const createMutation = trpc.admin.createReview.useMutation({
    onSuccess: () => {
      toast.success("Review created");
      setIsAdding(false);
      setNewReview({ productId: "", authorName: "", rating: 5, comment: "" });
      utils.admin.getRecentReviews.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.admin.updateReview.useMutation({
    onSuccess: () => {
      toast.success("Review updated");
      setEditingReview(null);
      utils.admin.getRecentReviews.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const autoGenerateMutation = trpc.admin.autoGenerateReviews.useMutation({
    onSuccess: (data) => {
      toast.success(`Successfully generated ${data.count} reviews`);
      setIsAutoGenerating(false);
      setAutoGenProductId("");
      utils.admin.getRecentReviews.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  if (loading || isLoading) return null;
  if (!user || user.role !== "admin") {
    setLocation("/");
    return null;
  }

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newReview.productId || !newReview.authorName || !newReview.comment) {
      toast.error("Please fill in all fields");
      return;
    }
    createMutation.mutate(newReview);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingReview.authorName || !editingReview.comment) {
      toast.error("Please fill in required fields");
      return;
    }
    updateMutation.mutate({
      reviewId: editingReview._id,
      authorName: editingReview.authorName,
      rating: editingReview.rating,
      comment: editingReview.comment,
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
              <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground mb-1">
                Manage Reviews
              </h1>
              <Link href="/admin">
                <span className="text-primary font-bold uppercase tracking-widest text-xs flex items-center gap-1 cursor-pointer hover:underline">
                  <ArrowLeft className="w-3 h-3" /> Back to Dashboard
                </span>
              </Link>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground font-black uppercase tracking-widest px-6 py-3 hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" /> Add Review
            </button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background border border-border"
        >
          <div className="grid-cols-12 gap-4 p-4 border-b border-border text-xs font-black uppercase tracking-widest text-muted-foreground bg-muted/20 hidden md:grid">
            <div className="col-span-3">Product</div>
            <div className="col-span-3">Author</div>
            <div className="col-span-2">Rating</div>
            <div className="col-span-3">Comment</div>
            <div className="col-span-1 text-right">Act</div>
          </div>
          {reviews.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground font-bold uppercase tracking-widest">
              No reviews found.
            </div>
          ) : (
            reviews.map((r) => (
              <div
                key={r._id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-border items-center hover:bg-muted/10 transition-colors"
              >
                <div className="md:col-span-3 font-black uppercase tracking-tighter text-foreground">
                  {r.product?.title || "Unknown"}
                </div>
                <div className="md:col-span-3 text-sm font-bold text-muted-foreground">
                  {r.authorName || "Unknown"}
                </div>
                <div className="md:col-span-2 font-black text-lg text-primary">
                  {r.rating} / 5
                </div>
                <div className="md:col-span-3 text-sm line-clamp-2">
                  {r.comment}
                </div>
                <div className="md:col-span-1 flex justify-end gap-2">
                  <button
                    onClick={() => setEditingReview(r)}
                    className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/20"
                    title="Edit Review"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete review?`))
                        deleteMutation.mutate({ reviewId: r._id });
                    }}
                    className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors border border-transparent hover:border-destructive/20"
                    title="Delete Review"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background border border-border w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground">
                  Add New Review
                </h3>
                <button
                  onClick={() => setIsAdding(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddSubmit} className="p-6 space-y-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">
                    Product
                  </label>
                  <select
                    value={newReview.productId}
                    onChange={(e) =>
                      setNewReview({ ...newReview, productId: e.target.value })
                    }
                    className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary font-bold"
                    required
                  >
                    <option value="">Select a Product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={newReview.authorName}
                    onChange={(e) =>
                      setNewReview({ ...newReview, authorName: e.target.value })
                    }
                    className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary font-bold"
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newReview.rating}
                    onChange={(e) =>
                      setNewReview({
                        ...newReview,
                        rating: parseInt(e.target.value),
                      })
                    }
                    className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">
                    Comment
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                    className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary font-bold resize-none"
                    rows={4}
                    required
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <button
                    type="submit"
                    disabled={
                      createMutation.isPending || autoGenerateMutation.isPending
                    }
                    className="flex-1 bg-foreground text-background font-black uppercase tracking-widest py-4 hover:bg-primary transition-colors disabled:opacity-50"
                  >
                    {createMutation.isPending ? "Creating..." : "Save Review"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newReview.productId)
                        return toast.error("Select a product first");
                      autoGenerateMutation.mutate({
                        productId: newReview.productId,
                      });
                    }}
                    disabled={
                      createMutation.isPending || autoGenerateMutation.isPending
                    }
                    className="flex-1 bg-secondary text-secondary-foreground font-black uppercase tracking-widest py-4 hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {autoGenerateMutation.isPending
                      ? "Generating..."
                      : "Auto-Gen 5 Reviews"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background border border-border w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground">
                  Edit Review
                </h3>
                <button
                  onClick={() => setEditingReview(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={editingReview.authorName}
                    onChange={(e) =>
                      setEditingReview({
                        ...editingReview,
                        authorName: e.target.value,
                      })
                    }
                    className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={editingReview.rating}
                    onChange={(e) =>
                      setEditingReview({
                        ...editingReview,
                        rating: parseInt(e.target.value),
                      })
                    }
                    className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">
                    Comment
                  </label>
                  <textarea
                    value={editingReview.comment}
                    onChange={(e) =>
                      setEditingReview({
                        ...editingReview,
                        comment: e.target.value,
                      })
                    }
                    className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary font-bold resize-none"
                    rows={4}
                    required
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="flex-1 bg-foreground text-background font-black uppercase tracking-widest py-4 hover:bg-primary transition-colors disabled:opacity-50"
                  >
                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
