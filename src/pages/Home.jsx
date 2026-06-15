import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ChevronRight, Zap, Star, Truck, RefreshCw, Lock } from "lucide-react";
import { trpc } from "@/lib/trpc";

// A dummy carousel component for the "Amazon/Myntra" dense product row feel
function ProductCarousel({ title, tag, items }) {
  return (
    <div className="py-12 border-b border-border">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            {tag && <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary mb-2"><Zap className="w-4 h-4 fill-primary" /> {tag}</span>}
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground">{title}</h2>
          </div>
          <Link href="/products">
            <button className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors">
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
        
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-8 -mx-4 px-4 lg:mx-0 lg:px-0 snap-x">
          {items.map((item, i) => (
            <Link key={i} href="/products">
              <div className="w-[160px] min-w-[160px] md:w-[260px] md:min-w-[300px] group cursor-pointer snap-start relative">
                <div className="relative aspect-3/4 bg-muted mb-2 md:mb-4 overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  {item.badge && (
                    <div className="absolute top-0 left-0 bg-primary text-primary-foreground text-[10px] md:text-xs font-black uppercase tracking-widest px-2 py-1 md:px-3 md:py-1.5 z-10">
                      {item.badge}
                    </div>
                  )}
                  {/* Quick Add overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center py-2 md:py-4 font-bold uppercase tracking-widest text-[10px] md:text-xs z-20">
                    Quick Add
                  </div>
                </div>
                <div className="flex items-center gap-0.5 md:gap-1 mb-1">
                  <Star className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 fill-foreground text-foreground" />
                  <Star className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 fill-foreground text-foreground" />
                  <Star className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 fill-foreground text-foreground" />
                  <Star className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 fill-foreground text-foreground" />
                  <Star className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 fill-foreground text-foreground" />
                  <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground ml-1">(128)</span>
                </div>
                <h3 className="font-bold text-foreground text-xs md:text-lg uppercase tracking-tight leading-tight mb-0.5 md:mb-1 group-hover:text-primary transition-colors line-clamp-1 truncate">{item.title}</h3>
                <p className="text-muted-foreground text-xs md:text-sm font-bold">{item.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const trendingItems = [
    { title: "Essential Cotton Tee", price: "₹899", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600", badge: "Best Seller" },
    { title: "Utility Cargo Pants", price: "₹2499", img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600" },
    { title: "Oversized Hoodie", price: "₹1899", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600", badge: "New" },
    { title: "Classic Denim Jacket", price: "₹3499", img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=600" },
    { title: "Summer Shorts", price: "₹799", img: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=600", badge: "-20%" },
  ];

  const newArrivals = [
    { title: "Athletic Tracksuit", price: "₹3999", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600", badge: "Just Dropped" },
    { title: "Premium Sando", price: "₹499", img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600" },
    { title: "Rain Coat Pro", price: "₹1599", img: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?auto=format&fit=crop&q=80&w=600" },
    { title: "Performance Socks 3-Pack", price: "₹399", img: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&q=80&w=600" },
    { title: "Woven Lungi", price: "₹599", img: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&q=80&w=600" },
  ];

  const { data: categories = [] } = trpc.commerce.categories.list.useQuery();
  const { data: recentReviews = [] } = trpc.commerce.reviews.listRecent.useQuery();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      
      {/* Hero Section (Zara/Nike style full bleed) */}
      <section className="relative h-[85vh] w-full bg-foreground overflow-hidden">
        {/* Full background image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Fashion" 
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
        </div>

        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 pb-16 lg:pb-24 flex flex-col md:flex-row justify-between items-end gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-3xl"
            >
              <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.85] text-background mb-6">
                Redefine <br/>
                <span className="text-primary">Standard.</span>
              </h1>
              <p className="text-lg md:text-xl text-background/80 font-bold uppercase tracking-widest max-w-lg mb-8 border-l-4 border-primary pl-4">
                The Summer '26 Collection. Engineered for durability. Styled for the streets.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <button className="bg-primary text-primary-foreground font-black uppercase tracking-widest px-10 py-5 hover:bg-white hover:text-foreground transition-colors flex items-center gap-3">
                    Shop Collection <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link href="/products?cat=sale">
                  <button className="bg-transparent border-2 border-background text-background font-black uppercase tracking-widest px-10 py-5 hover:bg-background hover:text-foreground transition-colors">
                    View Sale
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Grid Banner / Promo Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 border-b border-border">
        {[
          { title: "Free Shipping", sub: "On orders over ₹1500", icon: <Truck className="w-8 h-8" /> },
          { title: "30-Day Returns", sub: "No questions asked", icon: <RefreshCw className="w-8 h-8" /> },
          { title: "Secure Payment", sub: "100% safe checkout", icon: <Lock className="w-8 h-8" /> },
        ].map((promo, i) => (
          <div key={i} className="flex items-center gap-4 p-8 border-b md:border-b-0 md:border-r border-border last:border-0 bg-muted/20">
            <span className="text-primary flex items-center justify-center">{promo.icon}</span>
            <div>
              <h4 className="font-black uppercase tracking-wider text-foreground">{promo.title}</h4>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{promo.sub}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Dense Product Carousels */}
      <ProductCarousel title="Trending Right Now" tag="Hot Sellers" items={trendingItems} />
      
      {/* Massive Ad Banner (Amazon style deal highlight) */}
      <section className="border-b border-border">
        <Link href="/products?cat=jeans">
          <div className="relative h-[400px] w-full overflow-hidden group cursor-pointer bg-foreground">
            <img 
              src="https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=2000" 
              alt="Jeans Sale" 
              className="w-full h-full object-cover opacity-50 transition-transform duration-1000 group-hover:scale-105" 
            />
            <div className="absolute inset-0 flex items-center justify-center text-center px-4">
              <div>
                <span className="inline-block bg-primary text-primary-foreground font-black uppercase tracking-widest px-4 py-2 mb-6">Limited Time Offer</span>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-background mb-6">
                  Denim <br className="md:hidden" /> Blowout
                </h2>
                <p className="text-2xl text-background font-black uppercase tracking-widest mb-8">Up to 50% Off Signature Jeans</p>
                <button className="bg-background text-foreground font-black uppercase tracking-widest px-10 py-5 hover:bg-primary hover:text-primary-foreground transition-colors">
                  Shop Denim Deals
                </button>
              </div>
            </div>
          </div>
        </Link>
      </section>

      <ProductCarousel title="Just Dropped" tag="New Arrivals" items={newArrivals} />

      {/* Dynamic Category List */}
      <section className="py-12 border-b border-border bg-muted/10">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground mb-8">Shop All Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/products?cat=${cat.slug}`}>
                <div className="group cursor-pointer border border-border bg-background p-4 flex flex-col items-center justify-center aspect-4/3 text-center hover:bg-foreground hover:text-background transition-colors duration-300">
                  <span className="font-black uppercase tracking-widest text-sm line-clamp-2">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      {recentReviews.length > 0 && (
        <section className="py-16 md:py-24 border-b border-border bg-background text-foreground">
          <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary mb-2"><Star className="w-4 h-4 fill-primary" /> Verified Reviews</span>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">What the Streets <br className="md:hidden" /> Are Saying</h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentReviews.slice(0, 4).map((review) => (
                <div key={review._id} className="bg-muted/20 border border-border p-6 flex flex-col justify-between hover:bg-muted/40 transition-colors">
                  <div>
                    <div className="flex items-center gap-1 mb-4 text-primary">
                      {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary" />)}
                    </div>
                    <p className="text-sm md:text-base font-medium leading-relaxed mb-6">"{review.comment}"</p>
                  </div>
                  <div className="border-t border-border pt-4 flex items-center justify-between">
                    <div>
                      <p className="font-black uppercase tracking-widest text-sm text-foreground">{review.authorName}</p>
                      {review.product && (
                        <Link href={`/products/${review.product.handle || review.product._id}`}>
                          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1 hover:text-primary transition-colors cursor-pointer line-clamp-1">
                            On: {review.product.title}
                          </p>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-foreground text-background pt-16 pb-8 border-t-16 border-primary">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-2">
              <h2 className="text-5xl font-black tracking-tighter mb-6 uppercase">AMAR <span className="text-primary">Jeans</span></h2>
              <p className="text-muted-foreground max-w-sm text-sm font-bold uppercase tracking-widest leading-relaxed">
                The Ultimate E-Commerce Destination. <br/>
                High Quality. High Utility. No Compromises.
              </p>
            </div>
            <div>
              <h3 className="text-background font-black uppercase tracking-widest mb-6 border-b border-muted-foreground pb-4">Categories</h3>
              <ul className="space-y-3">
                {categories.slice(0, 6).map(cat => (
                  <li key={cat.id}>
                    <Link href={`/products?cat=${cat.slug}`}>
                      <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer text-sm font-bold uppercase tracking-wider">{cat.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-background font-black uppercase tracking-widest mb-6 border-b border-muted-foreground pb-4">Support</h3>
              <ul className="space-y-3 text-muted-foreground text-sm font-bold uppercase tracking-wider">
                <li>+91 9834557990</li>
                <li>+91 8149987987</li>
                <li className="hover:text-primary transition-colors cursor-pointer">contact@amarjeans.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-muted-foreground pt-8 flex flex-col md:flex-row items-center justify-between text-muted-foreground text-xs font-bold uppercase tracking-widest">
            <p>&copy; {new Date().getFullYear()} AMAR JEANS. All Rights Reserved.</p>
            <p className="mt-4 md:mt-0">Mumbai, India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
