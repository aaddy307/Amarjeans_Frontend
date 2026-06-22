import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Trash2, Edit2, Plus, Star, X, Check } from "lucide-react";
import { toast } from "sonner";

export default function AdminReviews() {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ authorName: "", rating: 5, comment: "" });

  const utils = trpc.useContext();
  const { data: reviews = [], isLoading } = trpc.admin.getRecentReviews.useQuery();

  const deleteMutation = trpc.admin.deleteReview.useMutation({
    onSuccess: () => {
      toast.success("Review deleted successfully");
      utils.admin.getRecentReviews.invalidate();
      utils.commerce.reviews.listRecent.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete review");
    }
  });

  const updateMutation = trpc.admin.updateReview.useMutation({
    onSuccess: () => {
      toast.success("Review updated successfully");
      setEditingId(null);
      utils.admin.getRecentReviews.invalidate();
      utils.commerce.reviews.listRecent.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update review");
    }
  });

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this review?")) {
      deleteMutation.mutate({ reviewId: id });
    }
  };

  const startEdit = (review) => {
    setEditingId(review._id);
    setEditForm({
      authorName: review.authorName,
      rating: review.rating,
      comment: review.comment
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = (id) => {
    updateMutation.mutate({
      reviewId: id,
      ...editForm
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">Reviews</h1>
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mt-1">
            Manage product reviews
          </p>
        </div>
      </div>

      <div className="bg-background border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-black uppercase tracking-widest text-xs">Product</th>
                <th className="px-4 py-3 font-black uppercase tracking-widest text-xs">Author</th>
                <th className="px-4 py-3 font-black uppercase tracking-widest text-xs">Rating</th>
                <th className="px-4 py-3 font-black uppercase tracking-widest text-xs">Comment</th>
                <th className="px-4 py-3 font-black uppercase tracking-widest text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-muted-foreground font-medium">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review._id} className="border-b border-border last:border-0 hover:bg-muted/10">
                    <td className="px-4 py-3 font-bold">
                      {review.product?.title || "Unknown Product"}
                    </td>
                    
                    <td className="px-4 py-3">
                      {editingId === review._id ? (
                        <input 
                          type="text" 
                          value={editForm.authorName}
                          onChange={(e) => setEditForm({...editForm, authorName: e.target.value})}
                          className="w-full bg-transparent border border-border p-1 text-sm focus:outline-none focus:border-primary"
                        />
                      ) : (
                        review.authorName
                      )}
                    </td>
                    
                    <td className="px-4 py-3">
                      {editingId === review._id ? (
                        <input 
                          type="number" 
                          min="1" 
                          max="5"
                          value={editForm.rating}
                          onChange={(e) => setEditForm({...editForm, rating: parseInt(e.target.value)})}
                          className="w-16 bg-transparent border border-border p-1 text-sm focus:outline-none focus:border-primary"
                        />
                      ) : (
                        <div className="flex items-center text-primary">
                          {review.rating} <Star className="w-3 h-3 ml-1 fill-primary" />
                        </div>
                      )}
                    </td>
                    
                    <td className="px-4 py-3 max-w-xs truncate" title={review.comment}>
                      {editingId === review._id ? (
                        <input 
                          type="text" 
                          value={editForm.comment}
                          onChange={(e) => setEditForm({...editForm, comment: e.target.value})}
                          className="w-full bg-transparent border border-border p-1 text-sm focus:outline-none focus:border-primary"
                        />
                      ) : (
                        review.comment
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {editingId === review._id ? (
                          <>
                            <button 
                              onClick={() => saveEdit(review._id)}
                              className="p-1.5 text-green-600 hover:bg-green-100 transition-colors"
                              title="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={cancelEdit}
                              className="p-1.5 text-muted-foreground hover:bg-muted transition-colors"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => startEdit(review)}
                              className="p-1.5 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(review._id)}
                              className="p-1.5 text-destructive hover:bg-destructive/10 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
