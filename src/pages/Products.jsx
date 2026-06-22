import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, Search, Filter, Star, ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { Link, useLocation, useSearch } from "wouter";
import { useState } from "react";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Products() {
  const [location] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const activeCategoryParam = searchParams.get("cat") || "all";

  const { data: products = [], isLoading: isLoadingProducts } = trpc.commerce.products.list.useQuery();
  const { data: categories = [], isLoading: isLoadingCategories } = trpc.commerce.categories.list.useQuery();
  const { addItem } = useCart();
  
  const [searchTerm, setSearchTerm] = useState("");
  const activeCategory = activeCategoryParam;
  const [activeRating, setActiveRating] = useState(0);
  const [sortBy, setSortBy] = useState("Recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileCatMenuOpen, setMobileCatMenuOpen] = useState(false);
  const productsPerPage = 12;

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

  const sortedAndFilteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "Newest":
        return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
      case "Price (Low-High)":
        return (a.priceRange?.min?.amount || 0) - (b.priceRange?.min?.amount || 0);
      case "Price (High-Low)":
        return (b.priceRange?.min?.amount || 0) - (a.priceRange?.min?.amount || 0);
      case "Recommended":
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedAndFilteredProducts.length / productsPerPage);
  const paginatedProducts = sortedAndFilteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleAdd = (e, variantId) => {
    e.preventDefault();
    addItem(variantId, 1);
  };

  return (
    <div className="min-h-screen bg-background pt-8 pb-12 overflow-hidden selection:bg-primary selection:text-primary-foreground">
      
      {/* Top Banner (Utility style) */}
      <div className="border-b border-border bg-muted/20">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <Link href="/"><span className="hover:text-foreground cursor-pointer transition-colors">Home</span></Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground">{activeCategory === "all" ? "All Products" : activeCategory}</span>
            </div>
            {/* Mobile Categories Toggle */}
            <button 
              className="md:hidden text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileCatMenuOpen(!mobileCatMenuOpen)}
            >
              {mobileCatMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          <div className="text-sm font-bold text-foreground">
            {sortedAndFilteredProducts.length} <span className="text-muted-foreground">items found</span>
          </div>

          {/* Mobile Categories Menu */}
          <AnimatePresence>
            {mobileCatMenuOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: "auto", opacity: 1 }} 
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden flex flex-col gap-4 pt-4 mt-2 border-t border-border overflow-hidden w-full"
              >
                <Link href={`/products?cat=all`} onClick={() => setMobileCatMenuOpen(false)}>
                  <span className={`block text-xs font-bold uppercase tracking-widest ${activeCategory === 'all' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>All Products</span>
                </Link>
                {categories.map(cat => (
                  <Link key={cat.id} href={`/products?cat=${cat.slug}`} onClick={() => setMobileCatMenuOpen(false)}>
                    <span className={`block text-xs font-bold uppercase tracking-widest ${activeCategory === cat.slug ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>{cat.name}</span>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 mt-8 flex flex-col gap-8 relative">
        
        {/* Product Grid */}
        <main className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl md:text-5xl font-black text-foreground uppercase tracking-tighter">
              {activeCategory === "all" ? "Shop All" : activeCategory}
            </h1>
            <div className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
              <span className="text-muted-foreground">Sort By:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none outline-none text-foreground font-black cursor-pointer"
              >
                <option value="Recommended">Recommended</option>
                <option value="Newest">Newest</option>
                <option value="Price (Low-High)">Price (Low-High)</option>
                <option value="Price (High-Low)">Price (High-Low)</option>
              </select>
            </div>
          </div>

          {isLoadingProducts || isLoadingCategories ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="bg-muted/50 aspect-3/4 animate-pulse border border-border" />
              ))}
            </div>
          ) : sortedAndFilteredProducts.length === 0 ? (
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
              {paginatedProducts.map((product) => (
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
                          {product.compareAtPrice > Number(product.priceRange.min.amount) && (
                            <span className="bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-3 py-1.5 shadow-sm">
                              -{Math.round(((product.compareAtPrice - Number(product.priceRange.min.amount)) / product.compareAtPrice) * 100)}%
                            </span>
                          )}
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
                        <div className="mt-auto flex items-center gap-2">
                          <span className="text-xl font-black text-foreground">₹{product.priceRange.min.amount}</span>
                          {product.compareAtPrice > Number(product.priceRange.min.amount) && (
                            <span className="text-sm font-bold text-muted-foreground line-through">₹{product.compareAtPrice}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-16">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-border text-foreground font-black uppercase tracking-widest text-xs disabled:opacity-50 hover:bg-muted transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 flex items-center justify-center border font-black text-sm transition-colors ${
                      currentPage === i + 1 
                        ? "bg-foreground text-background border-foreground" 
                        : "bg-transparent text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-border text-foreground font-black uppercase tracking-widest text-xs disabled:opacity-50 hover:bg-muted transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
