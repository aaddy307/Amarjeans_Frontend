import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";

export default function Cart() {
  const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();
  const createOrder = trpc.commerce.orders.create.useMutation();
  const { data: settings } = trpc.commerce.settings.get.useQuery();
  const items = cart?.items ?? [];

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", address: "", pincode: "" });

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, address, pincode } = orderForm;
    if (!name || !phone || !address || !pincode) {
      toast.error("Please fill in all the details.");
      return;
    }
    try {
      await createOrder.mutateAsync({
        cartItems: items,
        totalPrice: cart?.total?.amount || "0"
      });
      const supportPhoneRaw = settings?.whatsappNumber || settings?.supportPhone?.split('/')?.[0] || "919834557990";
      const phoneNumber = supportPhoneRaw.replace(/[^\d+]/g, "").replace(/^\+/, "");
      let text = `*New Order*\n\n*Customer Details:*\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\nPincode: ${pincode}\n\n*Items:*\n`;
      items.forEach(item => {
        text += `- ${item.productTitle} (Qty: ${item.quantity}) - ₹${item.lineTotal.amount}\n`;
      });
      text += `\n*Total: ₹${cart?.total?.amount}*`;
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, "_blank");
      clearCart();
      setIsCheckoutOpen(false);
      toast.success("Order confirmed!");
    } catch (err) {
      toast.error("Failed to create order");
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 selection:bg-primary selection:text-primary-foreground">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/products">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs mb-8 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Continue Shopping
            </button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tighter mb-2">Your Cart</h1>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">{items.length} item{items.length !== 1 ? "s" : ""}</p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            className="text-center py-32 border border-border bg-muted/10 mt-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-6 stroke-1" />
            <h2 className="text-3xl font-black text-foreground uppercase tracking-tighter mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm mb-10">Add some items from our shop to get started</p>
            <Link href="/products">
              <motion.button
                className="bg-foreground text-background font-black uppercase tracking-widest px-10 py-4 hover:bg-primary transition-colors text-lg"
                whileTap={{ scale: 0.97 }}
              >
                Shop Now
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {items.map((item, i) => (
                  <motion.div
                    key={item.lineId}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-background border border-border p-6 flex gap-6 items-center"
                  >
                    {item.image ? (
                      <div className="w-24 h-32 shrink-0 bg-muted overflow-hidden border border-border">
                        <img src={item.image.url} alt={item.productTitle} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-24 h-32 shrink-0 bg-muted flex items-center justify-center border border-border">
                        <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-foreground font-black uppercase tracking-tight text-xl mb-1 truncate">{item.productTitle}</h3>
                      {item.variantTitle && item.variantTitle !== "Default Title" && (
                        <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest mb-3">{item.variantTitle}</p>
                      )}
                      <p className="text-foreground font-black text-2xl">
                        {item.unitPrice.currencyCode === "INR" ? "₹" : item.unitPrice.currencyCode} {item.unitPrice.amount}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-6 justify-between h-full">
                      <motion.button
                        className="text-muted-foreground hover:text-destructive transition-colors p-2"
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => removeItem(item.lineId)}
                        disabled={loading}
                        title="Remove Item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                      
                      {/* Qty controls */}
                      <div className="flex items-center bg-muted/30 border border-border">
                        <motion.button
                          className="p-3 text-muted-foreground hover:text-foreground transition-colors hover:bg-muted"
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                          disabled={loading}
                        >
                          <Minus className="w-4 h-4" />
                        </motion.button>
                        <span className="text-foreground font-black w-10 text-center text-lg">{item.quantity}</span>
                        <motion.button
                          className="p-3 text-muted-foreground hover:text-foreground transition-colors hover:bg-muted"
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                          disabled={loading}
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <motion.div
              className="bg-background border border-border p-8 h-fit sticky top-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-black text-foreground uppercase tracking-tighter mb-8 pb-4 border-b border-border">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-muted-foreground font-bold uppercase tracking-widest text-sm">
                  <span>Subtotal</span>
                  <span className="text-foreground">{cart?.subtotal?.currencyCode === "INR" ? "₹" : cart?.subtotal?.currencyCode} {cart?.subtotal?.amount}</span>
                </div>
                <div className="flex justify-between text-muted-foreground font-bold uppercase tracking-widest text-sm pb-4 border-b border-border">
                  <span>Shipping</span>
                  <span className="text-foreground">Calculated at checkout</span>
                </div>
                <div className="flex justify-between font-black text-xl pt-2">
                  <span className="text-foreground uppercase">Total</span>
                  <span className="text-foreground">{cart?.total?.currencyCode === "INR" ? "₹" : cart?.total?.currencyCode} {cart?.total?.amount}</span>
                </div>
              </div>
              <motion.button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full bg-foreground text-background font-black uppercase tracking-widest py-5 flex items-center justify-center gap-3 hover:bg-primary transition-colors text-lg"
                whileTap={{ scale: 0.98 }}
                disabled={loading || createOrder.isPending}
              >
                Checkout <ArrowRight className="w-5 h-5" />
              </motion.button>
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] text-center mt-6">Secure Checkout via WhatsApp</p>
            </motion.div>
          </div>
        )}

        {/* Checkout Details Modal Overlay */}
        <AnimatePresence>
          {isCheckoutOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-background border border-border w-full max-w-md p-8 shadow-2xl relative"
              >
                <button 
                  onClick={() => setIsCheckoutOpen(false)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors font-black uppercase"
                >
                  Close
                </button>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground mb-6">Complete Order</h3>
                <p className="text-sm font-bold text-muted-foreground mb-6 uppercase tracking-widest">
                  Fill your details to complete the order via WhatsApp.
                </p>
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
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
                      disabled={createOrder.isPending}
                      className="w-full bg-foreground text-background font-black uppercase tracking-widest px-6 py-4 hover:bg-primary transition-colors disabled:opacity-50"
                    >
                      {createOrder.isPending ? "Processing..." : "Continue to WhatsApp"}
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
