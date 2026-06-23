import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" }
];

export default function Header() {
  const { itemCount } = useCart();
  const { data: categories = [] } = trpc.commerce.categories.list.useQuery();
  const { data: dbProducts = [] } = trpc.commerce.products.list.useQuery();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [location, setLocation] = useLocation();

  const isAuthPage = ["/admin/login", "/register", "/forgot-password"].includes(location);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { 
    setMobileOpen(false); 
  }, [location]);

  const suggestions = searchQuery.trim()
    ? dbProducts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || (p.productType && p.productType.toLowerCase().includes(searchQuery.toLowerCase()))).slice(0, 5)
    : [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  if (isAuthPage) return null;

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 bg-background border-b transition-all duration-300 ${
          scrolled ? "border-border shadow-sm" : "border-border"
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Top utility bar */}
        <div className="bg-foreground text-background py-1 px-4 text-center text-xs font-bold uppercase tracking-widest hidden md:block">
          Free Shipping on all orders over ₹1500. 
          <Link href="/products">
            <span className="text-primary hover:underline cursor-pointer ml-2">Shop Now</span>
          </Link>
        </div>

        {/* Main Header Row */}
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-1.5 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="cursor-pointer select-none flex items-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img src="/image.png" alt="AMAR JEANS" className="h-[60px] md:h-[70px] object-contain" />
            </motion.div>
          </Link>

          {/* Desktop Search Bar (Amazon/Myntra utility vibe) */}
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <form onSubmit={handleSearch} className="w-full flex relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search for products, brands and more..."
                className="w-full bg-muted/30 border-2 border-border text-foreground px-5 py-3 rounded-none outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground font-medium"
              />
              <button type="submit" className="absolute right-0 top-0 bottom-0 px-5 bg-foreground text-background hover:bg-primary transition-colors flex items-center justify-center">
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && searchQuery.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-background border border-border shadow-xl z-50 max-h-96 overflow-y-auto"
                >
                  {suggestions.length > 0 ? (
                    <div className="flex flex-col">
                      {suggestions.map((p) => (
                        <div 
                          key={p.id}
                          onClick={() => {
                            setLocation(`/product/${p.handle}`);
                            setSearchQuery("");
                            setShowSuggestions(false);
                          }}
                          className="flex items-center gap-4 p-3 hover:bg-muted cursor-pointer transition-colors border-b border-border last:border-0"
                        >
                          <div className="w-12 h-16 bg-muted shrink-0 overflow-hidden">
                            {p.images?.[0]?.url && <img src={p.images[0].url} alt={p.title} className="w-full h-full object-cover" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold uppercase tracking-widest text-foreground line-clamp-1">{p.title}</p>
                            <p className="text-xs text-muted-foreground font-bold mt-1">₹{p.priceRange?.min?.amount}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm font-bold uppercase tracking-widest text-muted-foreground">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right side (Icons) */}
          <div className="flex items-center gap-6">
            <Link href="/cart">
              <motion.button
                className="relative flex flex-col items-center gap-1 text-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                  <AnimatePresence>
                    {itemCount > 0 && (
                      <motion.span
                        key="badge"
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-none w-5 h-5 flex items-center justify-center border-2 border-background"
                      >
                        {itemCount > 9 ? "9+" : itemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:block">Cart</span>
              </motion.button>
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-1 text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-7 h-7 stroke-[1.5]" /> : <Menu className="w-7 h-7 stroke-[1.5]" />}
            </button>
          </div>
        </div>

        {/* Bottom Categories Row (Desktop) */}
        <div className="hidden md:flex border-t border-border bg-background h-10 items-center px-4 lg:px-8 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-10 shrink-0">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={`text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors whitespace-nowrap ${
                  location === link.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}>
                  {link.label}
                </span>
              </Link>
            ))}
            {categories.length > 0 && <div className="w-px h-4 bg-border shrink-0 ml-2 mr-2" />}
          </div>
          <div className="flex items-center gap-10 overflow-x-auto hide-scrollbar flex-1 pl-4">
            <Link href="/products?cat=all">
              <span className="text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors text-foreground hover:text-primary whitespace-nowrap">
                ALL PRODUCTS
              </span>
            </Link>
            {categories.map(cat => (
              <Link key={cat.id} href={`/products?cat=${cat.slug}`}>
                <span className="text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors text-foreground hover:text-primary whitespace-nowrap">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden border-t border-border p-3 bg-background relative z-50">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search products..."
              className="w-full bg-muted/30 border border-border text-foreground px-4 py-2.5 outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground text-sm"
            />
            <button type="submit" className="absolute right-0 top-0 bottom-0 px-4 bg-foreground text-background flex items-center justify-center">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Mobile Suggestions Dropdown */}
          <AnimatePresence>
              {showSuggestions && searchQuery.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full left-0 right-0 mt-1 mx-3 bg-background border border-border shadow-xl z-50 max-h-80 overflow-y-auto"
                >
                  {suggestions.length > 0 ? (
                    <div className="flex flex-col">
                      {suggestions.map((p) => (
                        <div 
                          key={p.id}
                          onClick={() => {
                            setLocation(`/product/${p.handle}`);
                            setSearchQuery("");
                            setShowSuggestions(false);
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer transition-colors border-b border-border last:border-0"
                        >
                          <div className="w-10 h-14 bg-muted shrink-0 overflow-hidden">
                            {p.images?.[0]?.url && <img src={p.images[0].url} alt={p.title} className="w-full h-full object-cover" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-bold uppercase tracking-widest text-foreground line-clamp-1">{p.title}</p>
                            <p className="text-[10px] text-muted-foreground font-bold mt-1">₹{p.priceRange?.min?.amount}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      No results found
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
        </div>

        {/* Mobile menu overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "100vh" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-background overflow-y-auto absolute top-full left-0 right-0 z-40 border-t border-border"
            >
              <nav className="flex flex-col">
                <div className="p-6 border-b border-border space-y-4">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span className={`block text-2xl font-black uppercase tracking-tighter ${location === link.href ? "text-primary" : "text-foreground"}`}>
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>

                  {/* Categories removed from here as per user request to only show them in the Products page hamburger menu on mobile */}

              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer to account for fixed header (Top bar + Main + Category Row + Mobile Search) */}
      <div className="h-[140px] md:h-[150px] bg-background" />
    </>
  );
}
