import { motion } from "framer-motion";
import { Link } from "wouter";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(6,182,212,0.05) 0%, transparent 60%)" }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div className="text-center relative z-10" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <motion.div
          className="text-[12rem] font-black text-slate-800 leading-none select-none"
          animate={{ textShadow: ["0 0 0px #06b6d4", "0 0 40px rgba(6,182,212,0.2)", "0 0 0px #06b6d4"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          404
        </motion.div>
        <h1 className="text-4xl font-black text-white mb-4 -mt-8">Page Not Found</h1>
        <p className="text-slate-400 text-lg mb-10 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <motion.button
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-900 font-bold px-8 py-3 rounded-xl flex items-center gap-2"
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(6,182,212,0.4)" }}
              whileTap={{ scale: 0.97 }}
            >
              <Home className="w-4 h-4" /> Go Home
            </motion.button>
          </Link>
          <motion.button
            onClick={() => window.history.back()}
            className="border border-slate-700 text-slate-300 font-bold px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-slate-800/60 transition-colors"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
