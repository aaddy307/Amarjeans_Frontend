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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useLocation();

  const isAuthPage = ["/signin", "/register", "/forgot-password"].includes(location);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { 
    setMobileOpen(false); 
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/products?cat=${searchQuery.toLowerCase()}`);
      setSearchQuery("");
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
        <div className="bg-foreground text-background py-1.5 px-4 text-center text-xs font-bold uppercase tracking-widest hidden md:block">
          Free Shipping on all orders over ₹1500. 
          <Link href="/products">
            <span className="text-primary hover:underline cursor-pointer ml-2">Shop Now</span>
          </Link>
        </div>

        {/* Main Header Row */}
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-20 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="font-black text-3xl md:text-4xl tracking-tighter cursor-pointer select-none text-foreground uppercase whitespace-nowrap"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              AMAR <span className="text-primary">JEANS</span>
            </motion.div>
          </Link>

          {/* Desktop Search Bar (Amazon/Myntra utility vibe) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, brands and more..."
              className="w-full bg-muted/30 border-2 border-border text-foreground px-5 py-3 rounded-none outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground font-medium"
            />
            <button type="submit" className="absolute right-0 top-0 bottom-0 px-5 bg-foreground text-background hover:bg-primary transition-colors flex items-center justify-center">
              <Search className="w-5 h-5" />
            </button>
          </form>

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
        <div className="hidden md:flex border-t border-border bg-background h-12 items-center px-4 lg:px-8 max-w-[1440px] mx-auto overflow-x-auto hide-scrollbar gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span className={`text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors whitespace-nowrap ${
                location === link.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}>
                {link.label}
              </span>
            </Link>
          ))}
          {categories.length > 0 && <div className="w-px h-4 bg-border mx-2" />}
          {categories.slice(0, 8).map(cat => (
            <Link key={cat.id} href={`/products?cat=${cat.slug}`}>
              <span className="text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors text-foreground hover:text-primary whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden border-t border-border p-3 bg-background">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-muted/30 border border-border text-foreground px-4 py-2.5 outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground text-sm"
            />
            <button type="submit" className="absolute right-0 top-0 bottom-0 px-4 bg-foreground text-background flex items-center justify-center">
              <Search className="w-4 h-4" />
            </button>
          </form>
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

                {categories.length > 0 && (
                  <div className="p-6 border-b border-border">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Categories</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {categories.map((cat) => (
                        <Link key={cat.id} href={`/products?cat=${cat.slug}`}>
                          <span className="block text-sm font-bold uppercase tracking-wider text-foreground hover:text-primary">
                            {cat.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer to account for fixed header (Top bar + Main + Category Row + Mobile Search) */}
      <div className="h-[136px] md:h-[156px] bg-background" />
    </>
  );
}
