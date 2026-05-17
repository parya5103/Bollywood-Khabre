import React, { useState, useEffect } from "react";
import { 
  Flame, 
  Clapperboard, 
  Bookmark, 
  User, 
  Search,
  Filter,
  TrendingUp,
  Settings,
  Bell,
  Sun,
  Moon,
  Home,
  Activity,
  Shield,
  Zap,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import type { NewsArticle } from "@/src/types";

// Components
import NewsFeed from "./components/NewsFeed";
import UserProfile from "./components/UserProfile";
import ArticleView from "./components/ArticleView";

type View = "home" | "bollywood" | "hollywood" | "profile" | "saved" | "trending" | "reviews";

export default function App() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("home");
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  // ⚡ Bolt: Debounce state for search query to prevent excessive API calls
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [darkMode, setDarkMode] = useState(true);

  // ⚡ Bolt: Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (view !== "profile") {
      fetchNews();
    }
  }, [view, debouncedSearchQuery]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setSystemHealth(data);
    } catch (e) {
      setSystemHealth({ status: "offline" });
    }
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const category = view === "home" ? "" : view;
      // ⚡ Bolt: Use the debounced query for the API request
      const url = `/api/news?${category && category !== "saved" ? `category=${category}&` : ""}${debouncedSearchQuery ? `q=${debouncedSearchQuery}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      setNews(data);
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const RailItem = ({ icon: Icon, label, active, onClick }: { 
    icon: any, 
    label: string, 
    active: boolean, 
    onClick: () => void
  }) => (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-500",
        active 
          ? "bg-accent text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]" 
          : "text-slate-500 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon size={22} className={cn("transition-transform group-hover:scale-110", active && "animate-pulse")} />
      
      {/* Tooltip */}
      <span className="absolute left-[calc(100%+16px)] px-3 py-1.5 bg-dark-elevated border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50">
        {label}
      </span>
      
      {active && (
        <motion.div 
          layoutId="rail-active"
          className="absolute -left-1 w-1 h-8 bg-accent rounded-full"
        />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-dark-surface text-slate-100 flex font-sans selection:bg-accent/30 tracking-tight">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyber-purple/5 rounded-full blur-[150px]" />
      </div>

      {/* Control Rail */}
      <nav className="fixed left-0 top-0 bottom-0 w-20 flex flex-col items-center py-8 glass border-r border-white/5 z-[60]">
        <div className="w-12 h-12 bg-white text-black flex items-center justify-center rounded-2xl mb-12 shadow-xl shadow-white/5 hover:rotate-12 transition-transform cursor-pointer">
           <Clapperboard size={24} />
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <RailItem icon={Home} label="Terminal Home" active={view === "home"} onClick={() => setView("home")} />
          <RailItem icon={TrendingUp} label="Viral Matrix" active={view === "trending"} onClick={() => setView("trending")} />
          <RailItem icon={Clapperboard} label="Bollywood" active={view === "bollywood"} onClick={() => setView("bollywood")} />
          <RailItem icon={Globe} label="Hollywood" active={view === "hollywood"} onClick={() => setView("hollywood")} />
          <RailItem icon={Filter} label="Deep Reviews" active={view === "reviews"} onClick={() => setView("reviews")} />
          <div className="h-px w-8 bg-white/10 my-2 mx-auto" />
          <RailItem icon={Bookmark} label="Archived Stories" active={view === "saved"} onClick={() => setView("saved")} />
        </div>

        <div className="flex flex-col gap-4">
          <button onClick={() => setDarkMode(!darkMode)} className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-white transition-colors">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <RailItem icon={User} label="Identity Profile" active={view === "profile"} onClick={() => setView("profile")} />
        </div>
      </nav>

      {/* Main Command Center */}
      <main className="flex-1 ml-20 flex flex-col min-h-screen relative z-10">
        
        {/* Dynamic Header */}
        <header className="sticky top-0 z-50 px-8 py-6 flex items-center justify-between border-b border-white/5 bg-dark-surface/80 backdrop-blur-3xl">
          <div className="flex items-center gap-10 flex-1">
             <div>
               <h1 className="text-xl font-black uppercase tracking-tighter italic-human leading-none">{view === 'home' ? 'Pulse Terminal' : view}</h1>
               <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-600 tracking-widest mt-1">
                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live Scrape Ops
               </div>
             </div>

             <div className="relative flex-1 max-w-xl group">
               <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search global cine-intel nodes..."
                 className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-slate-700"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
             </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <div key={i} className="w-8 h-8 rounded-full border-2 border-dark-surface bg-slate-800 flex items-center justify-center overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${i}`} alt="user" />
                 </div>
               ))}
               <div className="w-8 h-8 rounded-full border-2 border-dark-surface bg-dark-elevated flex items-center justify-center text-[10px] font-black text-slate-500">
                 +12
               </div>
             </div>
             <div className="h-8 w-px bg-white/10" />
             <button className="relative w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white transition-all">
               <Bell size={20} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-dark-surface" />
             </button>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 p-10 max-w-[1600px] mx-auto w-full">
           <AnimatePresence mode="wait">
             <motion.div
               key={view}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.4, ease: "easeOut" }}
             >
               {view === "profile" ? (
                 <UserProfile />
               ) : (
                 <NewsFeed 
                   news={view === "saved" ? (news.filter(n => favorites.includes(n.id))) : news} 
                   loading={loading}
                   onArticleClick={(article) => setSelectedArticle(article)}
                   favorites={favorites}
                   onFavoriteToggle={toggleFavorite}
                   systemHealth={systemHealth}
                 />
               )}
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Terminal Footer */}
        <footer className="px-10 py-8 mt-auto border-t border-white/5 bg-dark-elevated/50">
           <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-8">
              <div className="flex items-center gap-10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-1">Architecture</span>
                  <span className="text-xs font-bold text-white uppercase italic-human">CinePulse Engine v2.4</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-1">Compute Node</span>
                  <span className="text-xs font-bold text-cyber-purple uppercase italic-human tracking-tighter">Gemini 1.5 Flash - Autonomous</span>
                </div>
              </div>

              <div className="flex items-center gap-8">
                 <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5 shadow-inner">
                    <Shield size={14} className="text-accent" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Zero-Trust Persistent State</span>
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">© 2026 CinePulse • Autonomous Intel</p>
              </div>
           </div>
        </footer>
      </main>

      <AnimatePresence>
        {selectedArticle && (
          <ArticleView 
            article={selectedArticle} 
            isOpen={!!selectedArticle} 
            onClose={() => setSelectedArticle(null)}
            isSaved={favorites.includes(selectedArticle.id)}
            onToggleSave={(e) => toggleFavorite(selectedArticle.id, e)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
