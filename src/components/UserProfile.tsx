import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Bell, Shield, LogOut, Star, ChevronRight, Check, Activity, Database, Zap } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("account");

  const sections = [
    { id: "account", label: "Identity Profile", icon: User },
    { id: "preferences", label: "Neural Filter", icon: Star },
    { id: "notifications", label: "Alert Matrix", icon: Bell },
    { id: "privacy", label: "Cyber Security", icon: Shield },
  ];

  return (
    <div className="max-w-6xl mx-auto py-16">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Navigation Rail */}
        <div className="w-full lg:w-80 space-y-12">
          <div className="relative group">
             <div className="absolute inset-0 bg-accent/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="relative p-10 glass-card bg-dark-elevated text-center flex flex-col items-center">
                <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-2 border-white/10 mb-6 p-1 group-hover:border-accent transition-colors duration-1000">
                  <img 
                    src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Lucky" 
                    alt="Avatar" 
                    className="w-full h-full rounded-[1.8rem] bg-slate-900"
                  />
                </div>
                <h3 className="text-2xl font-black text-white italic-human uppercase mb-2">Pratik Gupta</h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
                  <Zap size={10} className="text-orange-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Prime Operator</span>
                </div>
             </div>
          </div>

          <nav className="space-y-3">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={cn(
                  "w-full flex items-center justify-between p-5 rounded-[1.5rem] transition-all duration-700 group",
                  activeTab === section.id 
                    ? "bg-accent text-white shadow-accent/20 shadow-2xl" 
                    : "text-slate-500 hover:bg-white/[0.03] hover:text-white border border-transparent hover:border-white/5"
                )}
              >
                <div className="flex items-center gap-4">
                  <section.icon size={20} className={activeTab === section.id ? "animate-pulse" : ""} />
                  <span className="text-[11px] uppercase tracking-[0.2em] font-black">{section.label}</span>
                </div>
                <ChevronRight size={18} className={cn("opacity-0 transition-all", activeTab === section.id ? "opacity-100" : "group-hover:opacity-100 group-hover:translate-x-1")} />
              </button>
            ))}
          </nav>

          <button className="w-full flex items-center justify-center gap-4 p-5 rounded-[1.5rem] border border-red-500/10 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all">
            <LogOut size={16} /> Termination Sequence
          </button>
        </div>

        {/* Console Viewport */}
        <div className="flex-1">
          <div className="glass-card bg-dark-elevated p-12 lg:p-20 shadow-[0_0_100px_rgba(0,0,0,0.5)] min-h-[700px] border-white/5">
             <AnimatePresence mode="wait">
               {activeTab === "account" && (
                 <motion.div key="account" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <div className="flex items-center gap-4 mb-16">
                      <div className="w-1.5 h-10 bg-accent" />
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Identity Parameter Access</h3>
                   </div>
                   
                   <div className="space-y-12">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block">Core Identifier</label>
                         <input type="text" defaultValue="Pratik Gupta" className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-5 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all text-sm font-bold placeholder:text-slate-800" />
                       </div>
                       <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block">Communications Link</label>
                         <input type="email" defaultValue="pratik@cinepulse.ai" className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-5 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all text-sm font-bold placeholder:text-slate-800" />
                       </div>
                     </div>
                     
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block">Psychographics / Bio</label>
                        <textarea defaultValue="Film analyst. Neural node connected to CinePulse since 2024. Expert in Bollywood/Hollywood synthesis." className="w-full h-40 bg-white/[0.02] border border-white/10 rounded-2xl p-5 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all resize-none text-sm font-bold" />
                     </div>

                     <div className="flex items-center gap-6 pt-10">
                        <button className="px-12 py-5 bg-accent text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-accent/20 shadow-2xl hover:bg-accent-deep transition-all">
                          Sync Identify
                        </button>
                        <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest italic-human">Last Sync: Today 19:44</p>
                     </div>
                   </div>
                 </motion.div>
               )}

               {activeTab === "preferences" && (
                 <motion.div key="pref" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <div className="flex items-center gap-4 mb-16">
                      <div className="w-1.5 h-10 bg-cyber-purple" />
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Neural Filter Config</h3>
                   </div>

                   <div className="space-y-16">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6 block">Intelligence Priorities</div>
                            <div className="space-y-4">
                               {["Bollywood Global", "Hollywood Synthesis", "Reviews Engine"].map(t => (
                                 <div key={t} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 transition-all hover:bg-white/10 group cursor-pointer">
                                    <span className="text-xs font-bold text-white uppercase">{t}</span>
                                    <Check size={16} className="text-accent" />
                                 </div>
                               ))}
                            </div>
                         </div>

                         <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6 block">Active Trackers</div>
                            <div className="flex flex-wrap gap-2">
                               {["SRK", "Nolan Matrix", "Marvel Intel", "Deepika Ops"].map(kw => (
                                 <span key={kw} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-accent cursor-pointer transition-colors">#{kw}</span>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                 </motion.div>
               )}

               {activeTab === "notifications" && (
                 <motion.div key="notif" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center justify-center min-h-[400px] text-center">
                    <div className="relative mb-12">
                       <div className="absolute inset-0 bg-accent/20 blur-[80px] rounded-full" />
                       <Bell size={64} className="text-accent relative animate-bounce" />
                    </div>
                    <h3 className="text-4xl font-black text-white italic-human uppercase mb-4 tracking-tighter">Alert Matrix</h3>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-12 max-w-sm mx-auto">Configure your neural link for priority intelligence streams.</p>
                    
                    <div className="w-full max-w-lg space-y-4 text-left">
                       {[
                         { l: "High Priority Viral Pulse", d: "Alerts for score > 90%" },
                         { l: "Actor Specific Intelligence", d: "Tracked actor news flashes" },
                         { l: "System Maintenance Nodes", d: "Platform architecture updates" }
                       ].map(n => (
                         <div key={n.l} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                            <div>
                               <p className="text-xs font-black text-white uppercase tracking-tight mb-1">{n.l}</p>
                               <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{n.d}</p>
                            </div>
                            <div className="w-12 h-6 bg-accent rounded-full flex items-center relative shadow-accent/20 shadow-xl">
                               <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm" />
                            </div>
                         </div>
                       ))}
                    </div>
                 </motion.div>
               )}

               {activeTab === "privacy" && (
                 <motion.div key="privacy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <div className="flex items-center gap-4 mb-16">
                      <div className="w-1.5 h-10 bg-red-600" />
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Cyber Security Protocols</h3>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="p-10 border border-white/5 rounded-[3rem] bg-white/[0.01]">
                         <Activity size={32} className="text-slate-800 mb-6" />
                         <h4 className="text-lg font-black text-white uppercase italic-human mb-4">Node Encryption</h4>
                         <p className="text-slate-500 text-xs font-bold leading-relaxed uppercase tracking-widest">Global end-to-end encryption active for all identity parameters and saved intelligence.</p>
                      </div>
                      <div className="p-10 border border-white/5 rounded-[3rem] bg-white/[0.01]">
                         <Database size={32} className="text-slate-800 mb-6" />
                         <h4 className="text-lg font-black text-white uppercase italic-human mb-4">Persistence Logs</h4>
                         <p className="text-slate-500 text-xs font-bold leading-relaxed uppercase tracking-widest">Your session data is localized and zero-trusted across all CinePulse edge nodes.</p>
                      </div>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
