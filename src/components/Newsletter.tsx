import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, CheckCircle, ArrowRight, Sparkles } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900/50 via-purple-900/30 to-indigo-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl group">
      {/* Decorative Blur */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 blur-[100px] rounded-full group-hover:bg-indigo-500/30 transition-colors" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
        <div className="space-y-3 flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/5">
            <Sparkles size={14} className="text-yellow-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">CinePulse Insider</span>
          </div>
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Get the hottest news delivered directly to you.
          </h3>
          <p className="text-sm text-indigo-200/60 max-w-sm">
            Join 120,000+ film fans. No spam, just high-octane Bollywood & Hollywood updates.
          </p>
        </div>

        <div className="w-full md:w-auto">
          {status === "success" ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-3 py-4 px-8 bg-green-500/20 border border-green-500/30 rounded-2xl"
            >
              <CheckCircle className="text-green-400" />
              <div className="text-left">
                <p className="text-sm font-bold text-white">You're in!</p>
                <p className="text-xs text-green-300/80">Check your inbox for the welcome blast.</p>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 sm:min-w-[300px]">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input 
                  type="email" 
                  placeholder="Enter your professional email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-sans"
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={status === "loading"}
                className="bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2 group/btn"
              >
                {status === "loading" ? "Processing..." : (
                  <>
                    Subscribe
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
