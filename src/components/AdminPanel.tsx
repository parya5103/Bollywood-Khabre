import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, RefreshCcw, Cpu, Globe, Share2, ShieldCheck, Activity, Lock, TrendingUp, DollarSign, Facebook, Twitter, Instagram, Plus, Power } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface Props {
  onRefresh: () => void;
}

export default function AdminPanel({ onRefresh }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] CinePulse Core Terminal Initialized...",
    "[BACKEND] News Aggregator Node: ONLINE",
    "[SOCIAL] Real-time Posting Service: READY",
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOriginalData, setShowOriginalData] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (e) {
      addLog("ERROR: Failed to fetch system intelligence stats.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: adminId, password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        addLog(`[AUTH] Admin identity verified. Remote session established.`);
      } else {
        setLoginError("Invalid credentials across core nodes.");
      }
    } catch (e) {
      setLoginError("Connection refused by Auth Subsystem.");
    }
  };

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  const handleAction = async (action: string, label: string) => {
    setIsProcessing(true);
    addLog(`Initiating ${label}...`);
    try {
      const res = await fetch("/api/admin/refresh", { method: "POST" });
      if (res.ok) {
        addLog(`${label} EXECUTED SUCCESSFULY.`);
        onRefresh();
      }
    } catch (e) {
      addLog(`CRITICAL ERROR: ${label} FAILED.`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-6"
      >
        <div className="w-full max-w-md glass p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-white">
            <Lock size={120} />
          </div>
          
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center text-purple-400 mb-8 border border-purple-500/20 mx-auto">
              <ShieldCheck size={40} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Command Authentication</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-10">Protected Backend Infrastructure</p>
            
            <form onSubmit={handleLogin} className="space-y-6 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity ID</label>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="admin"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-purple-500 transition-all text-sm font-medium placeholder:text-slate-700"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Key</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-purple-500 transition-all text-sm font-medium placeholder:text-slate-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {loginError && <p className="text-red-400 text-[10px] font-black uppercase tracking-widest animate-pulse text-center">{loginError}</p>}
              <button className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl shadow-purple-500/20 text-white font-black uppercase tracking-widest rounded-2xl hover:brightness-110 active:scale-95 transition-all text-xs">
                Authorize Session
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="py-2 px-0 space-y-8 animate-fade-in">
      {/* Top Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-6 rounded-[2rem] border border-green-500/10">
          <TrendingUp size={24} className="text-green-500 mb-4" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SEO Authority</p>
          <div className="flex items-baseline gap-2">
             <p className="text-3xl font-black text-white">{stats?.seo?.health}%</p>
             <span className="text-[10px] text-green-500 font-bold uppercase underline">Excellent</span>
          </div>
        </div>
        <div className="glass p-6 rounded-[2rem] border border-amber-500/10">
          <DollarSign size={24} className="text-amber-500 mb-4" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AdSense Cluster</p>
          <p className="text-3xl font-black text-white">${stats?.monetization?.monthlyEst}</p>
          <p className="text-[9px] text-amber-500 font-bold mt-1 uppercase tracking-tighter tracking-widest">AD UNITS: ACTIVE</p>
        </div>
        <div className="glass p-6 rounded-[2rem] border border-blue-500/10">
          <Activity size={24} className="text-blue-500 mb-4" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Node Health</p>
          <p className="text-3xl font-black text-white">4.ms</p>
          <p className="text-[9px] text-blue-500 font-bold mt-1 uppercase tracking-widest">LATENCY: NOMINAL</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Social Presence Hub */}
        <div className="glass rounded-[2.5rem] p-8 border border-white/5">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Social Graph Connectors</h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Cross-platform auto-posting enabled</p>
            </div>
            <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">LIVE</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {stats?.social?.pages.map((page: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-5 glass-dark rounded-[2rem] hover:bg-white/[0.03] transition-all border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400">
                    {page.name.includes("Facebook") ? <Facebook size={24} /> : page.name.includes("X") ? <Twitter size={24} /> : <Instagram size={24} />}
                  </div>
                  <div>
                    <p className="font-black text-sm text-white uppercase tracking-tight">{page.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                       <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{page.followers} followers</p>
                       <span className="w-1 h-1 bg-slate-700 rounded-full" />
                       <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Handshaking</span>
                    </div>
                  </div>
                </div>
                <button className="px-5 py-2.5 glass rounded-xl text-[10px] font-black text-white hover:bg-white/10 transition-colors uppercase tracking-widest">
                  Configure
                </button>
              </div>
            ))}
            <button className="w-full py-4 border-2 border-dashed border-white/5 rounded-[2rem] flex items-center justify-center gap-3 text-slate-500 hover:text-slate-100 hover:border-white/20 transition-all">
              <Plus size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Connect New Platform Node</span>
            </button>
          </div>
        </div>

        {/* System Control Panel */}
        <div className="space-y-6">
          <div className="glass rounded-[2.5rem] p-8 border border-white/5">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-10">System Manipulators</h3>
             <div className="grid grid-cols-2 gap-4">
               <button 
                onClick={() => handleAction("REFRESH", "GLOBAL SYNC")}
                disabled={isProcessing}
                className="flex flex-col items-center justify-center gap-4 p-8 glass-dark rounded-[2.5rem] hover:border-purple-500/50 transition-all group"
              >
                <div className="p-4 glass rounded-[1.5rem] text-purple-400 group-hover:rotate-180 transition-transform duration-700">
                  <RefreshCcw size={28} />
                </div>
                <p className="font-black text-[10px] text-white uppercase tracking-widest">Sync Aggregator</p>
              </button>
              <button 
                onClick={() => setShowOriginalData(!showOriginalData)}
                className="flex flex-col items-center justify-center gap-4 p-8 glass-dark rounded-[2.5rem] hover:border-blue-500/50 transition-all group"
              >
                <div className={cn("p-4 glass rounded-[1.5rem] transition-colors", showOriginalData ? "text-blue-400" : "text-slate-500")}>
                  <Globe size={28} />
                </div>
                <p className="font-black text-[10px] text-white uppercase tracking-widest">{showOriginalData ? "Hide Data" : "Inspect Data"}</p>
              </button>
             </div>
          </div>

          {/* Terminal / JSON View */}
          <div className="glass rounded-[2rem] p-6 bg-black/40 h-[300px] flex flex-col border border-white/5 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                  {showOriginalData ? "Raw Intelligence Stream" : "Kernel Operations Log"}
                </h3>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              </div>
              <div className="flex-1 font-mono text-[10px] space-y-2 overflow-y-auto scrollbar-hide text-slate-400">
                {showOriginalData ? (
                  <pre className="p-2 text-blue-300">
                    {JSON.stringify(stats, null, 2)}
                  </pre>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className="py-1.5 border-l-2 border-purple-500/30 pl-4">
                      <span className="text-purple-500/50 mr-2">❯</span>
                      {log}
                    </div>
                  ))
                )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

