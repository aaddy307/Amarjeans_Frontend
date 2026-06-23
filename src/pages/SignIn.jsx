import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Eye, EyeOff, LogIn, ArrowRight, X } from "lucide-react";
import { Link } from "wouter";

export default function SignIn() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const utils = trpc.useUtils();
  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: (data) => {
      utils.auth.me.setData(undefined, data.user);
      if (data.user?.role === "admin") {
        setLocation("/admin");
      } else {
        setLocation("/");
      }
    },
    onError: (err) => {
      setError(err.message);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="h-screen overflow-hidden flex bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      
      {/* Left side: Editorial Image (Hidden on mobile) */}
      <div className="hidden lg:block w-1/2 relative bg-foreground">
        <img 
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200" 
          alt="Fashion Editorial" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent" />
        <div className="absolute bottom-12 left-12 max-w-md">
          <motion.h1 
            className="text-7xl font-black uppercase tracking-tighter text-background mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <img src="/logo.png" alt="AMAR JEANS" className="h-16 object-contain mb-4" />
          </motion.h1>
          <motion.p 
            className="text-background/80 font-bold uppercase tracking-widest text-sm leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Join the community. Gain access to exclusive drops, early sale entry, and personalized style recommendations.
          </motion.p>
        </div>
      </div>

      {/* Right side: Stark Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-md relative">
          <button onClick={() => setLocation("/")} className="absolute -top-12 md:top-0 right-0 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-6 h-6" />
          </button>
          
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="lg:hidden mb-8 cursor-pointer bg-foreground py-1 px-3 rounded-sm inline-block" onClick={() => setLocation("/")}>
              <img src="/logo.png" alt="AMAR JEANS" className="h-10 object-contain" />
            </div>
            
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-foreground flex items-center justify-center">
                <LogIn className="w-6 h-6 text-background" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground">Admin Login</h2>
            </div>
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mt-4">Restricted Access</p>
          </motion.div>

          <motion.div
            animate={isShaking ? { x: [-8, 8, -8, 8, -4, 4, 0], transition: { duration: 0.5 } } : {}}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="text-foreground text-xs font-black uppercase tracking-widest mb-2 block">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-muted/20 border-2 border-border px-4 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors font-bold"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-foreground text-xs font-black uppercase tracking-widest block">Password</label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-muted/20 border-2 border-border px-4 py-4 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors font-bold"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-destructive/10 border-l-4 border-destructive p-4 text-destructive text-xs font-bold uppercase tracking-wider"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-foreground text-background font-black uppercase tracking-widest py-5 flex items-center justify-center gap-3 hover:bg-primary transition-colors disabled:opacity-50 mt-8"
              >
                {loginMutation.isPending ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-background border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>Sign In <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
