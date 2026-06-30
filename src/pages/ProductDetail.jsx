import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { ShoppingBag, ChevronLeft, Star, MessageSquare } from "lucide-react";
import { Link, useParams } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function ProductDetail() {
  const { handle } = useParams();
  const utils = trpc.useContext();
  const { user } = useAuth();
  
  const { data: product, isLoading } = trpc.commerce.products.byHandle.useQuery({ handle });
  const { data: settings } = trpc.commerce.settings.get.useQuery();
  const { data: reviews = [] } = trpc.commerce.reviews.listByProduct.useQuery(
    { productId: product?.id },
    { enabled: !!product?.id }
  );
  
  const { addItem, removeItem, cart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewForm, setReviewForm] = useState({ authorName: "", rating: 5, comment: "" });

  const [isDirectOrderOpen, setIsDirectOrderOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", address: "", pincode: "" });

  const cartItem = cart?.items?.find(i => i.variantId === product?.variants?.[0]?.id);
  const inCart = !!cartItem;

  const createReviewMutation = trpc.commerce.reviews.create.useMutation({
    onSuccess: () => {
      toast.success("Review submitted!");
      setIsReviewing(false);
      setReviewForm({ authorName: "", rating: 5, comment: "" });
      utils.commerce.reviews.listByProduct.invalidate({ productId: product.id });
    },
    onError: (err) => toast.error(err.message)
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    createReviewMutation.mutate({ productId: product.id, ...reviewForm });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 px-4">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-3/4 bg-muted animate-pulse" />
          <div className="space-y-4">
            <div className="h-16 bg-muted animate-pulse" />
            <div className="h-8 bg-muted animate-pulse w-2/3" />
            <div className="h-32 bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-5xl font-black uppercase tracking-tighter text-foreground mb-4">Not Found</h2>
          <Link href="/products"><button className="text-primary font-bold uppercase tracking-widest hover:underline">← Back to Shop</button></Link>
        </div>
      </div>
    );
  }

  const variant = product.variants[0];

  const handleAdd = async () => {
    if (!variant) return;
    setAdding(true);
    try {
      await addItem(variant.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async () => {
    if (!cartItem) return;
    setAdding(true);
    try {
      await removeItem(cartItem.lineId);
      toast.success("Removed from Bag");
    } catch (err) {
      toast.error("Failed to remove item");
    } finally {
      setAdding(false);
    }
  };

  const handleDirectOrder = (e) => {
    e.preventDefault();
    const { name, phone, address, pincode } = orderForm;
    if (!name || !phone || !address || !pincode) {
      toast.error("Please fill in all the details.");
      return;
    }
    const message = `*New Direct Order*
Product: ${product.title} (₹${product.priceRange.min.amount})

*Customer Details:*
Name: ${name}
Phone: ${phone}
Address: ${address}
Pincode: ${pincode}`;

    const supportPhoneRaw = settings?.whatsappNumber || settings?.supportPhone?.split('/')?.[0] || "919834557990";
    const whatsappNumber = supportPhoneRaw.replace(/[^\d+]/g, "").replace(/^\+/, "");
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    setIsDirectOrderOpen(false);
  };



  return (
    <div className="min-h-screen bg-background pt-12 pb-24 px-4 selection:bg-primary selection:text-primary-foreground">
      <div className="max-w-[1440px] mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/products">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs font-black uppercase tracking-widest mb-12 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Products
            </button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="aspect-3/4 bg-muted overflow-hidden mb-4 border border-border">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]?.url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-24 h-32 overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? "border-foreground" : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {product.productType && (
              <span className="text-xs font-black uppercase tracking-widest text-primary mb-4 block">
                {product.productType}
              </span>
            )}

            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-foreground leading-[0.9] mb-6">
              {product.title}
            </h1>

            <div className="flex items-center gap-2 mb-8">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-5 h-5 ${i <= (product.averageRating || 5) ? "text-foreground fill-foreground" : "text-muted-foreground"}`} />
                ))}
              </div>
              <span className="text-muted-foreground text-sm font-bold uppercase tracking-widest">({reviews.length} Reviews)</span>
            </div>

            <div className="text-4xl font-black text-foreground mb-8 flex items-center gap-4">
              <span>₹{product.priceRange.min.amount}</span>
              {product.compareAtPrice > Number(product.priceRange.min.amount) && (
                <>
                  <span className="text-2xl font-bold text-muted-foreground line-through">₹{product.compareAtPrice}</span>
                  <span className="bg-primary text-primary-foreground text-sm px-3 py-1 font-black uppercase tracking-widest">
                    Save {Math.round(((product.compareAtPrice - Number(product.priceRange.min.amount)) / product.compareAtPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            <p className="text-muted-foreground text-sm md:text-base font-bold leading-relaxed mb-12">
              {product.description || "No description provided."}
            </p>

            {/* Add / Remove from Cart */}
            {cartItem ? (
              <motion.button
                onClick={handleRemove}
                disabled={adding}
                className="w-full py-6 mt-auto font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
                whileTap={{ scale: 0.98 }}
              >
                {adding ? (
                  <motion.div className="w-6 h-6 border-2 border-background border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                ) : (
                  <><ShoppingBag className="w-6 h-6" /> Remove from Bag</>
                )}
              </motion.button>
            ) : (
              <motion.button
                onClick={handleAdd}
                disabled={adding}
                className="w-full py-6 mt-auto font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-colors bg-foreground text-background hover:bg-primary"
                whileTap={{ scale: 0.98 }}
              >
                {adding ? (
                  <motion.div className="w-6 h-6 border-2 border-background border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                ) : (
                  <><ShoppingBag className="w-6 h-6" /> Add to Bag</>
                )}
              </motion.button>
            )}
            
            {/* Direct Order Button */}
            <motion.button
              onClick={() => setIsDirectOrderOpen(true)}
              className="w-full py-6 mt-4 font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-colors bg-foreground text-background hover:bg-primary"
              whileTap={{ scale: 0.98 }}
            >
              Direct Order on WhatsApp
            </motion.button>
            
            <div className="grid grid-cols-3 gap-4 border-t border-border pt-8 mt-8">
              {["Free Shipping", "7 Day Returns", "Secure Checkout"].map(feature => (
                <div key={feature} className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{feature}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-border pt-16 mt-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-foreground">Customer Reviews</h2>
            {inCart && !isReviewing && (
              <button 
                onClick={() => setIsReviewing(true)}
                className="bg-foreground text-background font-black uppercase tracking-widest px-6 py-3 hover:bg-primary transition-colors text-sm"
              >
                Write a Review
              </button>
            )}
          </div>
          
          <div className="max-w-3xl mx-auto space-y-8">
              <AnimatePresence>
                {isReviewing && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-muted/10 border border-border p-8 overflow-hidden"
                  >
                    <h3 className="font-black uppercase tracking-widest text-foreground mb-6">Write Your Review</h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">Name</label>
                        <input 
                          type="text" value={reviewForm.authorName} onChange={e => setReviewForm({ ...reviewForm, authorName: e.target.value })}
                          className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary font-bold" required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">Rating</label>
                        <select 
                          value={reviewForm.rating} onChange={e => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                          className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary font-bold"
                        >
                          {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">Review</label>
                        <textarea 
                          value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary font-bold resize-y" rows={4} required
                        />
                      </div>
                      <div className="flex gap-4 pt-4">
                        <button 
                          type="submit" disabled={createReviewMutation.isPending}
                          className="bg-foreground text-background font-black uppercase tracking-widest px-6 py-3 hover:bg-primary transition-colors text-sm disabled:opacity-50"
                        >
                          {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                        </button>
                        <button 
                          type="button" onClick={() => setIsReviewing(false)}
                          className="border border-border bg-transparent text-foreground font-black uppercase tracking-widest px-6 py-3 hover:bg-muted transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {reviews.length === 0 ? (
                <div className="bg-muted/10 border border-border p-12 text-center flex flex-col items-center justify-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-foreground font-black uppercase tracking-widest">No reviews yet.</p>
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-2">Be the first to share your thoughts!</p>
                </div>
              ) : (
                <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar space-y-6">
                  {reviews.map(review => (
                    <div key={review._id} className="bg-background border border-border p-8">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-bold uppercase tracking-widest text-foreground">{review.authorName || "Anonymous"}</h4>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} className={`w-4 h-4 ${star <= review.rating ? "text-primary fill-primary" : "text-muted-foreground"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm font-bold leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
        </div>
        
        {/* Direct Order Modal Overlay */}
        <AnimatePresence>
          {isDirectOrderOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-100 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-background border border-border w-full max-w-md p-8 shadow-2xl relative"
              >
                <button 
                  onClick={() => setIsDirectOrderOpen(false)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors font-black uppercase"
                >
                  Close
                </button>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground mb-6">Direct Order</h3>
                <p className="text-sm font-bold text-muted-foreground mb-6 uppercase tracking-widest">
                  Fill your details to complete the order via WhatsApp.
                </p>
                <form onSubmit={handleDirectOrder} className="space-y-4">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">Name</label>
                    <input 
                      type="text" value={orderForm.name} onChange={e => setOrderForm({ ...orderForm, name: e.target.value })}
                      className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary font-bold" required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">Phone Number</label>
                    <input 
                      type="tel" value={orderForm.phone} onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })}
                      className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary font-bold" required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">Delivery Address</label>
                    <textarea 
                      value={orderForm.address} onChange={e => setOrderForm({ ...orderForm, address: e.target.value })}
                      className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary font-bold resize-y" rows={3} required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-foreground block mb-2">Pincode</label>
                    <input 
                      type="text" value={orderForm.pincode} onChange={e => setOrderForm({ ...orderForm, pincode: e.target.value })}
                      className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary font-bold" required
                    />
                  </div>
                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="w-full bg-foreground text-background font-black uppercase tracking-widest px-6 py-4 hover:bg-primary transition-colors"
                    >
                      Continue to WhatsApp
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
