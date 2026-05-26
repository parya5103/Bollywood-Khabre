import React from "react";
import { motion } from "motion/react";
import { Clock, Bookmark, Share2, Flame, Zap, Database, Activity, ChevronRight } from "lucide-react";
import { cn, formatDate } from "@/src/lib/utils";
import type { NewsArticle } from "@/src/types";
import Newsletter from "./Newsletter";

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
      <div className="space-y-12">
        <div className="h-[70vh] bg-white/[0.02] rounded-[3rem] animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 bg-white/[0.02] rounded-[2.5rem] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="relative"
        >
          <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full" />
          <div className="relative bg-dark-elevated border border-white/10 p-16 rounded-[4rem] text-center max-w-2xl shadow-[0_0_80px_rgba(0,0,0,0.5)]">
            <Zap size={48} className="text-accent mx-auto mb-8 animate-pulse" />
            <h2 className="text-4xl font-black uppercase italic-human text-white mb-6">Autonomous Engine Initializing</h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs leading-loose opacity-60">
              CinePulse AI is currently decrypting global entertainment RSS nodes. Intelligence synthesis in progress.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const featured = news[0];
  const list = news.slice(1);

  return (
    <div className="space-y-24 pb-20">
      {/* System Status Dashboard (Minimalist) */}
      <div className="flex flex-wrap items-center gap-6 p-6 glass-card border-white/5">
        <div className="flex items-center gap-3">
          <Activity size={16} className="text-green-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Status: <span className="text-white">Active</span></span>
        </div>
        <div className="flex items-center gap-3">
          <Database size={16} className="text-cyber-purple" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Persistence: <span className="text-white">Firestore Secure</span></span>
        </div>
        <div className="flex items-center gap-3">
          <Zap size={16} className="text-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">AI Latency: <span className="text-white">1.2s Synthesis</span></span>
        </div>
      </div>

      {/* Featured Headline Section */}
      {featured && (
        <section 
          className="group relative focus-within:ring-2 focus-within:ring-accent grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-[3rem] border border-white/10 shadow-black shadow-2xl hover:border-orange-500/30 transition-all duration-700"
        >
          <div className="lg:col-span-7 relative h-[60vh] lg:h-auto overflow-hidden">
            <img 
              src={featured.imageUrl} 
              alt={featured.title} 
              className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2s]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-dark-surface/80 via-transparent to-transparent hidden lg:block pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-surface via-transparent to-transparent lg:hidden pointer-events-none" />
          </div>
          
          <div className="lg:col-span-5 bg-dark-elevated p-10 md:p-16 flex flex-col justify-center">
            <div className="mb-10">
              <span className="inline-block px-4 py-1.5 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6 italic-human">
                Primary Intelligence
              </span>
              <h2 className="text-5xl md:text-6xl font-black text-white leading-[0.9] tracking-tighter uppercase mb-8 group-hover:italic transition-all">
                <button onClick={() => onArticleClick(featured)} className="before:absolute before:inset-0 text-left outline-none w-full">
                  {featured.title}
                </button>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed font-medium line-clamp-4">
                {featured.description}
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-10 border-t border-white/5">
              <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <span className="text-cyber-purple">{featured.author}</span>
                <span>•</span>
                <span>{formatDate(featured.publishedAt)}</span>
              </div>
              <button 
                aria-label={favorites.includes(featured.id) ? "Remove from saved" : "Save article"}
                onClick={(e) => onFavoriteToggle(featured.id, e)}
                className={cn(
                  "relative z-10 pointer-events-auto p-4 rounded-2xl border border-white/10 transition-all",
                  favorites.includes(featured.id) ? "bg-accent border-accent text-white" : "text-white/40 hover:text-white"
                )}
              >
                <Bookmark size={20} fill={favorites.includes(featured.id) ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {list.map((article, idx) => (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group relative focus-within:ring-2 focus-within:ring-accent rounded-[3rem] flex flex-col h-full"
          >
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-8 border border-white/10 shadow-black shadow-xl">
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[9px] font-black uppercase text-white/80 border border-white/20">
                    {article.category}
                  </span>
                  {article.viralScore > 80 && (
                     <span className="px-3 py-1 bg-red-600 rounded-full text-[9px] font-black uppercase text-white animate-pulse">
                       Trending
                     </span>
                  )}
                </div>
              </div>
              <button 
                aria-label={favorites.includes(article.id) ? "Remove from saved" : "Save article"}
                onClick={(e) => onFavoriteToggle(article.id, e)}
                className={cn(
                  "absolute z-10 pointer-events-auto top-6 right-6 p-4 rounded-2xl backdrop-blur-xl border border-white/20 transition-all",
                  favorites.includes(article.id) ? "bg-accent border-accent text-white" : "bg-black/20 text-white hover:bg-black/40"
                )}
              >
                <Bookmark size={18} fill={favorites.includes(article.id) ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="flex flex-col flex-1 px-2">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-3">
                <span className="w-1 h-3 bg-cyber-purple" />
                {article.author} • {formatDate(article.publishedAt)}
              </div>
              <h3 className="text-3xl font-black text-white leading-[1] tracking-tighter mb-4 group-hover:text-accent transition-colors">
                <button onClick={() => onArticleClick(article)} className="before:absolute before:inset-0 text-left outline-none w-full">
                  {article.title}
                </button>
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-8 opacity-70">
                {article.description}
              </p>
              
              <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex gap-2">
                  {article.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[9px] font-black uppercase text-slate-600">#{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-slate-500">
                  <div className="flex items-center gap-2">
                    <Flame size={14} className={article.viralScore > 70 ? "text-orange-500" : ""} />
                    <span className="text-[11px] font-bold">{article.viralScore}%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Persistent Comms Link */}
      <section className="pt-20">
         <Newsletter />
      </section>
    </div>
  );
}

