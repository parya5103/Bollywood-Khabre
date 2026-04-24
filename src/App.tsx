import React, { useState, useEffect } from "react";
import { 
  Search, 
  Flame, 
  Clapperboard, 
  Bookmark, 
  User, 
  Menu, 
  X,
  Share2,
  ChevronRight,
  TrendingUp,
  Filter,
  LogOut,
  Settings,
  Bell,
  Sun,
  Moon,
  Home
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import type { NewsArticle, UserPreferences } from "@/src/types";

// Components
import NewsFeed from "./components/NewsFeed";
import UserProfile from "./components/UserProfile";
import ArticleView from "./components/ArticleView";
import AdminPanel from "./components/AdminPanel";

type View = "home" | "bollywood" | "hollywood" | "profile" | "saved" | "trending" | "reviews" | "admin";

export default function App() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (view !== "profile" && view !== "admin") {
      fetchNews();
    }
  }, [view, searchQuery]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const category = view === "home" ? "" : view;
      const url = `/api/news?${category && category !== "saved" ? `category=${category}&` : ""}${searchQuery ? `q=${searchQuery}` : ""}`;
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

  const NavItem = ({ icon: Icon, label, active, onClick, id }: { 
    icon: any, 
    label: string, 
    active: boolean, 
    onClick: () => void,
    id: string
  }) => (
    <button
      id={id}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300",
        active 
          ? "bg-purple-500/10 text-purple-400 border-r-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.1)]" 
          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
      )}
    >
      <Icon size={20} className={active ? "animate-pulse" : ""} />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500 relative overflow-hidden",
      darkMode ? "bg-[#05070A] text-slate-100" : "bg-slate-50 text-slate-900"
    )}>
      {/* Mesh Gradients Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full glass border-r border-white/10 z-50 transition-all duration-300 overflow-hidden",
        isSidebarOpen ? "w-64" : "w-0 md:w-20"
      )}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-3 px-2 mb-10">
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-orange-500 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-purple-500/20">
              <Clapperboard className="text-white" size={24} />
            </div>
            {isSidebarOpen && (
              <h1 className="text-xl font-bold tracking-tight text-white">
                CinePulse <span className="text-orange-400">AI</span>
              </h1>
            )}
          </div>

          <nav className="flex-1 space-y-2">
            <NavItem id="nav-home" icon={Home} label="Discovery" active={view === "home"} onClick={() => setView("home")} />
            <NavItem id="nav-trending" icon={Flame} label="Viral Now" active={view === "trending"} onClick={() => setView("trending")} />
            <NavItem id="nav-bollywood" icon={Clapperboard} label="Bollywood" active={view === "bollywood"} onClick={() => setView("bollywood")} />
            <NavItem id="nav-hollywood" icon={TrendingUp} label="Hollywood" active={view === "hollywood"} onClick={() => setView("hollywood")} />
            <NavItem id="nav-reviews" icon={Filter} label="Top Reviews" active={view === "reviews"} onClick={() => setView("reviews")} />
            <div className="h-px bg-white/10 my-4" />
            <NavItem id="nav-saved" icon={Bookmark} label="Favorite Stories" active={view === "saved"} onClick={() => setView("saved")} />
          </nav>

          <div className="mt-auto space-y-2">
            <NavItem id="nav-profile" icon={User} label="Profile" active={view === "profile"} onClick={() => setView("profile")} />
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300 text-slate-400 hover:bg-white/5 hover:text-slate-100"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              {isSidebarOpen && <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "transition-all duration-300 min-h-screen relative z-10 flex flex-col",
        isSidebarOpen ? "pl-64" : "pl-0 md:pl-20"
      )}>
        {/* Header */}
        <header className="sticky top-4 z-40 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mx-6 my-4 shadow-2xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
            <div className="relative flex-1 max-w-2xl group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search actors, directors, or movies..."
                className="w-full bg-white/10 border border-white/5 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="md:flex hidden items-center space-x-1 bg-white/10 rounded-full px-3 py-1.5 text-[10px] font-bold tracking-widest text-slate-300">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>LIVE UPDATES</span>
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-100 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#05070A]" />
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto flex-1 h-full flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              {view === "profile" ? (
                <UserProfile />
              ) : (
                <NewsFeed 
                  news={view === "saved" ? news.filter(n => favorites.includes(n.id)) : news} 
                  loading={loading}
                  onArticleClick={(article) => setSelectedArticle(article)}
                  favorites={favorites}
                  onFavoriteToggle={toggleFavorite}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Minimal Static Footer */}
        <footer className="px-8 py-4 bg-white/5 backdrop-blur-md border-t border-white/10 flex items-center justify-between opacity-60">
          <div className="flex space-x-6 text-[10px] font-bold tracking-widest uppercase text-slate-500">
            <span>CinePulse AI • 2026</span>
          </div>
          <div className="flex space-x-6 text-[10px] font-bold tracking-widest uppercase items-center">
            <span className="text-orange-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span> DEPLOYED NODE</span>
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
