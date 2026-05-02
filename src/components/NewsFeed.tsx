import React from "react";
import { motion } from "motion/react";
import { Clock, MessageSquare, Bookmark, Share2, Flame } from "lucide-react";
import { cn, formatDate } from "@/src/lib/utils";
import type { NewsArticle } from "@/src/types";

interface Props {
  news: NewsArticle[];
  loading: boolean;
  onArticleClick: (article: NewsArticle) => void;
  favorites: string[];
  onFavoriteToggle: (id: string, e: React.MouseEvent) => void;
  systemHealth?: any;
}

export default function NewsFeed({ news, loading, onArticleClick, favorites, onFavoriteToggle, systemHealth }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass rounded-[2rem] h-[400px] animate-pulse" />
        ))}
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-center">
        <div className="bg-purple-500/10 border border-purple-500/20 p-12 rounded-[3rem] max-w-xl shadow-2xl backdrop-blur-xl">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 bg-gradient-to-tr from-purple-600 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-purple-500/20"
          >
            <Clock size={40} className="text-white" />
          </motion.div>
          
          <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter italic">Initializing Autonomous Feed...</h3>
          <p className="text-sm text-slate-400 mb-8 max-w-md mx-auto leading-relaxed uppercase tracking-widest font-bold opacity-60">
            The AI Scraping Engine is scanning RSS nodes across the global entertainment network. 
            Fresh intelligence will materialize shortly.
          </p>
          
          <div className="flex flex-col gap-4">
             <button 
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-white text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-purple-500 hover:text-white transition-all duration-500 active:scale-95 shadow-xl"
            >
              Force Node Re-Scan
            </button>
            <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest">
              Automated • No-Cost • Decentralized
            </p>
          </div>
        </div>
      </div>
    );
  }

  const featured = news[0];
  const list = news.slice(1);
  const breaking = news.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Breaking Ticker */}
      <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[1.5rem] py-3 px-6 flex items-center gap-4 overflow-hidden shadow-2xl relative">
        <div className="flex items-center gap-2 text-orange-500 font-black text-[10px] uppercase tracking-widest shrink-0">
          <Flame size={14} className="animate-pulse" /> Breaking Now
        </div>
        <div className="h-4 w-px bg-white/10 shrink-0" />
        <div className="flex-1 overflow-hidden">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 whitespace-nowrap"
          >
            {breaking.map(b => (
              <span key={b.id} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-white transition-colors" onClick={() => onArticleClick(b)}>
                <span className="text-white">●</span> {b.title}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Featured Article */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onArticleClick(featured)}
          className="group relative w-full aspect-[21/9] rounded-[2rem] overflow-hidden cursor-pointer glass hover:border-purple-500/50 transition-all duration-500 shadow-2xl"
        >
          <img 
            src={featured.imageUrl} 
            alt={featured.title}
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-[#05070A]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-orange-400 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-white/10 shadow-lg">
                TRENDING {featured.category}
              </span>
              <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">
                Featured Story • {formatDate(featured.publishedAt)}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4 group-hover:text-purple-400 transition-colors leading-none">
              {featured.title}
            </h2>
            <p className="text-slate-300 md:text-lg line-clamp-2 max-w-2xl opacity-70 font-medium">
              {featured.description}
            </p>
          </div>
          <button 
            onClick={(e) => onFavoriteToggle(featured.id, e)}
            className={cn(
              "absolute top-6 right-6 p-4 rounded-full backdrop-blur-xl transition-all duration-300 border border-white/10",
              favorites.includes(featured.id) 
                ? "bg-purple-500 text-white scale-110" 
                : "bg-white/5 text-white hover:bg-white/10"
            )}
          >
            <Bookmark size={24} fill={favorites.includes(featured.id) ? "currentColor" : "none"} />
          </button>
        </motion.div>
      )}

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((article, idx) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onArticleClick(article)}
            className="group relative glass rounded-[2rem] overflow-hidden cursor-pointer hover:border-purple-500/50 transition-all duration-300"
          >
            {/* Image Container */}
            <div className="relative aspect-[16/10] overflow-hidden">
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 shadow-lg",
                  article.category === "Bollywood" ? "bg-orange-500/80 text-white" : "bg-purple-500/80 text-white"
                )}>
                  {article.category}
                </span>
                {article.viralScore > 75 && (
                  <span className="px-3 py-1 bg-red-600/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/10 shadow-lg flex items-center gap-1">
                    <Flame size={12} fill="currentColor" /> HOT
                  </span>
                )}
              </div>
              <button 
                onClick={(e) => onFavoriteToggle(article.id, e)}
                className={cn(
                  "absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all duration-300 border border-white/10",
                  favorites.includes(article.id) 
                    ? "bg-purple-500 text-white scale-110" 
                    : "bg-black/20 text-white hover:bg-black/40"
                )}
              >
                <Bookmark size={16} fill={favorites.includes(article.id) ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-3">
                <span className="text-purple-400">
                  {article.author}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {formatDate(article.publishedAt)}
                </span>
              </div>
              
              <h3 className="text-xl font-bold leading-tight mb-2 group-hover:text-purple-400 transition-colors">
                {article.title}
              </h3>
              
              <p className="text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed opacity-80">
                {article.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex gap-2">
                  {article.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white/5 px-2 py-1 rounded-lg">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-slate-100 transition-colors">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

