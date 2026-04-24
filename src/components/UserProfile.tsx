import React, { useState } from "react";
import { motion } from "motion/react";
import { User, Bell, Shield, LogOut, Star, ChevronRight, Check, ShieldCheck } from "lucide-react";
import { cn } from "@/src/lib/utils";
import AdminPanel from "./AdminPanel";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("account");

  const sections = [
    { id: "account", label: "Account Information", icon: User },
    { id: "preferences", label: "News Preferences", icon: Star },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "admin", label: "Admin Console", icon: ShieldCheck },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
  ];

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 space-y-2">
          <div className="p-8 mb-6 glass rounded-[2.5rem] flex flex-col items-center">
            <div className="w-24 h-24 glass rounded-full flex items-center justify-center p-1 mb-4 relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-orange-500 rounded-full opacity-50 blur-lg group-hover:opacity-100 transition-opacity" />
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky" 
                alt="Avatar" 
                className="w-full h-full rounded-full relative z-10 glass"
              />
            </div>
            <h3 className="font-black text-xl text-white">Pratik Gupta</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">AI PRO MEMBER</p>
          </div>

          <nav className="space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group",
                  activeTab === section.id 
                    ? "bg-purple-500 text-white font-black shadow-lg shadow-purple-500/20" 
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <section.icon size={18} />
                  <span className="text-[11px] uppercase tracking-widest font-bold">{section.label}</span>
                </div>
                <ChevronRight size={16} className={cn("opacity-0 transition-all", activeTab === section.id ? "opacity-100 translate-x-0" : "group-hover:opacity-100 group-hover:translate-x-1")} />
              </button>
            ))}
          </nav>

          <button className="w-full mt-10 flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400/70 hover:bg-red-500/10 transition-colors">
            <LogOut size={18} />
            <span className="text-[11px] uppercase tracking-widest font-bold">Secure Logout</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          <div className="glass rounded-[2.5rem] p-10 shadow-xl min-h-[500px]">
             {activeTab === "account" && (
               <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                 <h3 className="text-xs font-black mb-10 text-slate-400 uppercase tracking-[0.2em]">Profile Architecture</h3>
                 <div className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operator Name</label>
                       <input type="text" defaultValue="Pratik Gupta" className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500 transition-colors text-sm font-medium" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Communications Node</label>
                       <input type="email" defaultValue="pratik@example.com" className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500 transition-colors text-sm font-medium" />
                     </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Professional Bio</label>
                      <textarea defaultValue="Lover of cinema, both Bollywood and Hollywood. Tech enthusiast and film critic at heart." className="w-full h-32 bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-purple-500 transition-colors resize-none text-sm font-medium" />
                   </div>
                   <button className="bg-gradient-to-r from-purple-500 to-orange-500 hover:shadow-purple-500/20 shadow-lg text-white font-black uppercase tracking-widest px-8 py-4 rounded-2xl transition-all">
                     Update Identity
                   </button>
                 </div>
               </motion.div>
             )}

             {activeTab === "preferences" && (
               <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                 <h3 className="text-xs font-black mb-10 text-slate-400 uppercase tracking-[0.2em]">Feed Configuration</h3>
                 <div className="space-y-12">
                   <div>
                     <label className="text-[10px] font-black text-slate-500 mb-6 block uppercase tracking-widest">Tracked Keywords</label>
                     <div className="flex flex-wrap gap-2">
                       {["SRK", "Christopher Nolan", "Marvel", "Deepika Padukone"].map(kw => (
                         <span key={kw} className="px-3 py-1 glass rounded-full text-[10px] font-bold text-purple-400 uppercase tracking-widest">#{kw}</span>
                       ))}
                     </div>
                   </div>
                 </div>
               </motion.div>
             )}

             {activeTab === "admin" && (
               <AdminPanel onRefresh={() => console.log("Refresh")} />
             )}

             {activeTab === "notifications" && (
               <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col items-center justify-center h-full text-center py-10">
                 <Bell size={48} className="text-slate-800 mb-6" />
                 <h3 className="text-2xl font-black mb-2 text-white">Alert Matrix</h3>
                 <div className="w-full space-y-4 max-w-md text-left mt-10">
                    <div className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-3xl">
                      <div>
                        <p className="font-black text-sm text-white uppercase tracking-tight">Breaking Stories</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Push notifications active</p>
                      </div>
                      <div className="w-10 h-5 bg-purple-500 rounded-full relative shadow-lg shadow-purple-500/20 cursor-pointer">
                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                      </div>
                    </div>
                 </div>
               </motion.div>
             )}

             {activeTab === "privacy" && (
               <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                 <h3 className="text-xs font-black mb-10 text-slate-400 uppercase tracking-[0.2em]">Security Protocol</h3>
                 <div className="p-10 glass rounded-[2rem] border-dashed border-white/10 flex flex-col items-center text-center">
                    <Shield size={32} className="text-slate-700 mb-4" />
                    <p className="text-slate-500 text-sm font-medium">Encryption Active. Fingerprinting enabled.</p>
                 </div>
               </motion.div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
