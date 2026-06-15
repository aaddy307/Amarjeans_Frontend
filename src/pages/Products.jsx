import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, Search, Filter, Star, ChevronDown, ChevronRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Products() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const activeCategoryParam = searchParams.get("cat") || "all";

  const { data: products = [], isLoading: isLoadingProducts } = trpc.commerce.products.list.useQuery();
  const { data: categories = [], isLoading: isLoadingCategories } = trpc.commerce.categories.list.useQuery();
  const { addItem } = useCart();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(activeCategoryParam);
  const [activeRating, setActiveRating] = useState(0);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(true);

  const filteredProducts = products.filter(p => {
    const searchLow = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
                          p.title.toLowerCase().includes(searchLow) || 
                          (p.description && p.description.toLowerCase().includes(searchLow)) ||
                          (p.vendor && p.vendor.toLowerCase().includes(searchLow));
    
    const catLow = activeCategory.toLowerCase();
    const matchesCategory = activeCategory === "all" || 
                            (p.productType && p.productType.toLowerCase().replace(/[^a-z0-9]/g, "") === catLow.replace(/[^a-z0-9]/g, "")) ||
                            (p.tags && p.tags.some(t => t.toLowerCase().replace(/[^a-z0-9]/g, "") === catLow.replace(/[^a-z0-9]/g, ""))) ||
                            p.title.toLowerCase().replace(/[^a-z0-9]/g, "").includes(catLow.replace(/[^a-z0-9]/g, ""));

    const matchesRating = activeRating === 0 || (p.averageRating && p.averageRating >= activeRating);

    return matchesSearch && matchesCategory && matchesRating;
  });

  const handleAdd = (e, variantId) => {
    e.preventDefault();
    addItem(variantId, 1);
  };

  return (
    <div className="min-h-screen bg-background pt-8 pb-12 overflow-hidden selection:bg-primary selection:text-primary-foreground">
      
      {/* Top Banner (Utility style) */}
      <div className="border-b border-border bg-muted/20">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Link href="/"><span className="hover:text-foreground cursor-pointer transition-colors">Home</span></Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{activeCategory === "all" ? "All Products" : activeCategory}</span>
          </div>
          <div className="text-sm font-bold text-foreground">
            {filteredProducts.length} <span className="text-muted-foreground">items found</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 mt-8 flex flex-col lg:flex-row gap-8 relative">
        
        {/* Sidebar Filters (Amazon/Myntra dense checklist style) */}
        <aside className="lg:w-64 shrink-0">
          <div className="sticky top-40 bg-background">
            <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
              <h2 className="text-lg font-black text-foreground uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" /> Filters
              </h2>
              <button 
                onClick={() => { setSearchTerm(""); setActiveCategory("all"); setActiveRating(0); }}
                className="text-xs font-bold text-primary uppercase tracking-widest hover:underline"
              >
                Clear All
              </button>
            </div>

            <div className="mb-6 border-b border-border pb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search brand or item..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-muted/30 border border-border text-foreground px-4 py-2.5 outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground text-sm"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <div className="mb-6 border-b border-border pb-6">
              <button 
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="w-full text-sm font-black text-foreground uppercase tracking-widest mb-3 flex items-center justify-between hover:text-primary transition-colors cursor-pointer"
              >
                Categories 
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCategoriesOpen ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {isCategoriesOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar pt-1">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 border ${activeCategory === "all" ? "bg-primary border-primary" : "border-muted-foreground group-hover:border-foreground"} flex items-center justify-center transition-colors`}>
                          {activeCategory === "all" && <div className="w-2 h-2 bg-primary-foreground" />}
                        </div>
                        <span className={`text-sm font-bold uppercase tracking-wider ${activeCategory === "all" ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`} onClick={() => setActiveCategory("all")}>All Items</span>
                      </label>
                      
                      {categories.map(cat => {
                        const catSlug = cat.slug;
                        return (
                          <label key={cat.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveCategory(catSlug)}>
                            <div className={`w-4 h-4 border ${activeCategory === catSlug ? "bg-primary border-primary" : "border-muted-foreground group-hover:border-foreground"} flex items-center justify-center transition-colors`}>
                              {activeCategory === catSlug && <div className="w-2 h-2 bg-primary-foreground" />}
                            </div>
                            <span className={`text-sm font-bold uppercase tracking-wider ${activeCategory === catSlug ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                              {cat.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mb-6 border-b border-border pb-6">
              <button 
                onClick={() => setIsRatingOpen(!isRatingOpen)}
                className="w-full text-sm font-black text-foreground uppercase tracking-widest mb-3 flex items-center justify-between hover:text-primary transition-colors cursor-pointer"
              >
                Customer Rating 
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isRatingOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isRatingOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 pt-1">
                      {[4, 3, 2, 1].map(stars => (
                        <label key={stars} className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveRating(activeRating === stars ? 0 : stars)}>
                          <div className={`w-4 h-4 border ${activeRating === stars ? "bg-primary border-primary" : "border-muted-foreground group-hover:border-foreground"} flex items-center justify-center transition-colors`}>
                            {activeRating === stars && <div className="w-2 h-2 bg-primary-foreground" />}
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < stars ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                            ))}
                            <span className={`text-xs font-bold uppercase ${activeRating === stars ? "text-foreground" : "text-muted-foreground"} ml-1`}>&amp; Up</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl md:text-5xl font-black text-foreground uppercase tracking-tighter">
              {activeCategory === "all" ? "Shop All" : activeCategory}
            </h1>
            <div className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
              <span className="text-muted-foreground">Sort By:</span>
              <select className="bg-transparent border-none outline-none text-foreground font-black cursor-pointer">
                <option>Recommended</option>
                <option>Newest</option>
                <option>Price (Low-High)</option>
                <option>Price (High-Low)</option>
              </select>
            </div>
          </div>

          {isLoadingProducts || isLoadingCategories ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="bg-muted/50 aspect-3/4 animate-pulse border border-border" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-muted/10 border border-border py-32 text-center flex flex-col items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-6 stroke-1" />
              <h3 className="text-3xl font-black text-foreground mb-2 uppercase tracking-tighter">Nothing Found</h3>
              <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest mb-8">Try adjusting your filters.</p>
              <button 
                onClick={() => { setSearchTerm(""); setActiveCategory("all"); }}
                className="bg-foreground text-background px-8 py-3 font-black uppercase tracking-widest hover:bg-primary transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-10"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            >
              {filteredProducts.map((product) => (
                <motion.div 
                  key={product.id} 
                  variants={cardVariants}
                >
                  <Link href={`/product/${product.handle}`}>
                    <div className="group cursor-pointer flex flex-col h-full relative">
                      <div className="relative overflow-hidden bg-muted aspect-3/4 mb-3">
                        {product.images[0] && (
                          <img 
                            src={product.images[0].url} 
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" 
                          />
                        )}
                        {/* Hover Quick Add overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center py-4 z-20">
                           <button
                              onClick={(e) => { if (product.variants[0]) handleAdd(e, product.variants[0].id); }}
                              className="font-black uppercase tracking-widest text-xs text-foreground hover:text-primary transition-colors flex items-center gap-2"
                            >
                              <ShoppingBag className="w-4 h-4" /> Quick Add
                            </button>
                        </div>
                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
                          {product.tags.slice(0, 1).map(tag => (
                            <span key={tag} className="bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-3 py-1.5 shadow-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3.5 h-3.5 ${i < Math.round(product.averageRating || 0) ? "fill-foreground text-foreground" : "fill-transparent text-muted-foreground"}`} 
                            />
                          ))}
                          <span className="text-[10px] font-bold text-muted-foreground ml-1">({product.totalReviews || 0})</span>
                        </div>
                        <h3 className="text-lg font-black text-foreground uppercase tracking-tight leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">{product.title}</h3>
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2">{product.vendor}</p>
                        <div className="mt-auto">
                          <span className="text-xl font-black text-foreground">₹{product.priceRange.min.amount}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
