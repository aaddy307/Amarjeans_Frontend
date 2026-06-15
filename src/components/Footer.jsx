import { Link } from "wouter";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 px-4 lg:px-8 mt-auto border-t border-border/10">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <Link href="/">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 cursor-pointer hover:text-primary transition-colors inline-block">
              AMAR <span className="text-primary">JEANS</span>
            </h2>
          </Link>
          <div className="mb-8 space-y-2">
            <p className="text-background/80 font-bold uppercase tracking-widest text-xs leading-relaxed max-w-sm">
              <span className="text-primary block mb-1">Location:</span>
              opp new fire brigade Chinchpada nalambi road amb (w)<br/>
              chnchpad rood new fire brigade opp titwala road ambernath w, Ambarnath 421501
            </p>
            <p className="text-background/80 font-bold uppercase tracking-widest text-xs leading-relaxed max-w-sm mt-4">
              <span className="text-primary block mb-1">Phone:</span>
              +91 9834557990<br/>
              +91 8149987987
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/amarjeans990/" target="_blank" rel="noreferrer" className="w-10 h-10 bg-background/10 flex items-center justify-center hover:bg-primary transition-colors text-background">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-background/10 flex items-center justify-center hover:bg-primary transition-colors text-background">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-background/10 flex items-center justify-center hover:bg-primary transition-colors text-background">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest mb-6">Shop</h3>
          <ul className="space-y-4">
            <li><Link href="/products"><span className="text-xs font-bold uppercase tracking-widest text-background/80 hover:text-primary transition-colors cursor-pointer">All Products</span></Link></li>
            <li><Link href="/products?cat=jeans"><span className="text-xs font-bold uppercase tracking-widest text-background/80 hover:text-primary transition-colors cursor-pointer">Jeans</span></Link></li>
            <li><Link href="/products?cat=shirts"><span className="text-xs font-bold uppercase tracking-widest text-background/80 hover:text-primary transition-colors cursor-pointer">Shirts</span></Link></li>
            <li><Link href="/products?cat=t-shirts"><span className="text-xs font-bold uppercase tracking-widest text-background/80 hover:text-primary transition-colors cursor-pointer">T-Shirts</span></Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-widest mb-6">Support</h3>
          <ul className="space-y-4">
            <li><Link href="/contact"><span className="text-xs font-bold uppercase tracking-widest text-background/80 hover:text-primary transition-colors cursor-pointer">Contact Us</span></Link></li>
            <li><Link href="/about"><span className="text-xs font-bold uppercase tracking-widest text-background/80 hover:text-primary transition-colors cursor-pointer">About Us</span></Link></li>
            <li><Link href="/contact"><span className="text-xs font-bold uppercase tracking-widest text-background/80 hover:text-primary transition-colors cursor-pointer">Returns & Exchanges</span></Link></li>
            <li><Link href="/contact"><span className="text-xs font-bold uppercase tracking-widest text-background/80 hover:text-primary transition-colors cursor-pointer">Shipping Policy</span></Link></li>
            <li className="pt-4 mt-4 border-t border-background/20"><Link href="/signin"><span className="text-xs font-bold uppercase tracking-widest text-primary hover:text-background transition-colors cursor-pointer">Admin Login</span></Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto mt-16 pt-8 border-t border-background/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-background/60">
          &copy; {new Date().getFullYear()} AMAR JEANS. All Rights Reserved.
        </p>
        <div className="flex gap-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-background/60 cursor-pointer hover:text-primary">Privacy Policy</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-background/60 cursor-pointer hover:text-primary">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
