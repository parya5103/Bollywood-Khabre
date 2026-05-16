import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, CheckCircle, ArrowRight, Zap, Target, Signal } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <div className="relative overflow-hidden bg-dark-elevated border border-white/5 rounded-[3rem] p-12 lg:p-20 group">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16 justify-between">
        <div className="space-y-6 flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-accent/10 rounded-xl border border-accent/20">
            <Signal size={14} className="text-accent animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Neural Feed Subscription</span>
          </div>
          
          <h3 className="text-4xl md:text-5xl font-black text-white leading-[0.9] tracking-tighter uppercase italic-human">
            Establish Direct <br /> <span className="text-slate-600">Intelligence Link.</span>
          </h3>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-6">
             <div className="flex items-center gap-3">
                <Target size={18} className="text-cyber-purple" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Zero Lag Updates</span>
             </div>
             <div className="flex items-center gap-3">
                <Zap size={18} className="text-orange-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">AI Synthesized</span>
             </div>
          </div>
        </div>

        <div className="w-full lg:w-[500px]">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div 
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-6 p-10 bg-green-500/5 border border-green-500/20 rounded-[2.5rem] text-center flex-col"
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/20">
                   <CheckCircle className="text-white" size={32} />
                </div>
                <div>
                  <p className="text-xl font-black text-white uppercase italic-human mb-2">Protocol Established</p>
                  <p className="text-[10px] text-green-300 font-bold uppercase tracking-widest leading-relaxed">Neural handshake complete. <br /> Check your comms node for verification.</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} key="form" className="space-y-6">
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-accent transition-colors transition-all" size={20} />
                  <input 
                    type="email" 
                    placeholder="ENTER OPERATOR EMAIL..." 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-[1.8rem] py-6 pl-16 pr-8 text-xs font-black text-white placeholder-slate-800 outline-none focus:ring-1 focus:ring-accent transition-all tracking-[0.2em]"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-accent hover:bg-accent-deep disabled:opacity-50 text-white font-black py-6 rounded-[1.8rem] transition-all shadow-accent/20 shadow-2xl flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.3em]"
                >
                  {status === "loading" ? "Initializing Link..." : (
                    <>
                      Secure Intelligence Path
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
