import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Bookmark, Share2, Flame, Languages, LineChart, Link2, Clock, User, Zap, Shield, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn, formatDate } from "@/src/lib/utils";
import type { NewsArticle } from "@/src/types";

interface Props {
  article: NewsArticle;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent) => void;
}

export default function ArticleView({ article, isOpen, onClose, isSaved, onToggleSave }: Props) {
  useEffect(() => {
    if (article.seoData?.schema) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(article.seoData.schema);
      document.head.appendChild(script);
      return () => {
        const existing = document.head.querySelector('script[type="application/ld+json"]');
        if (existing) document.head.removeChild(existing);
      };
    }
  }, [article]);

  const share = (platform: string) => {
    const url = window.location.href;
    const text = article.title;
    if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/95 backdrop-blur-3xl" />
      
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.95 }}
        className="relative w-full max-w-6xl max-h-[90vh] bg-dark-surface border border-white/10 rounded-[3rem] shadow-[0_0_150px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row"
      >
        <button onClick={onClose} className="absolute top-8 right-8 z-[110] p-4 bg-white/10 hover:bg-accent hover:text-white rounded-3xl transition-all"><X size={24} /></button>

        {/* Hero Poster Section */}
        <div className="md:w-5/12 relative bg-black overflow-hidden group">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-surface via-dark-surface/40 to-transparent" />
          
          <div className="absolute bottom-16 left-12 right-12">
            <div className="flex gap-3 mb-8">
              <span className="px-4 py-1.5 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl">
                {article.category}
              </span>
              <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white/60 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/10">
                Level 4 Intel
              </span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-white leading-[0.85] tracking-tighter mb-10 uppercase italic-human">
              {article.title}
            </h2>
            
            <div className="flex flex-wrap gap-8 text-slate-500 text-[10px] font-black uppercase tracking-widest border-t border-white/10 pt-10">
              <div className="flex flex-col">
                <span className="text-slate-700 mb-2 font-black uppercase tracking-widest">Architect</span>
                <span className="text-cyber-purple">{article.author}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-700 mb-2 font-black uppercase tracking-widest">Timestamp</span>
                <span className="text-white">{formatDate(article.publishedAt)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-700 mb-2 font-black uppercase tracking-widest">Matrix Location</span>
                <span className="text-white">Global Feed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Content Section */}
        <div className="md:w-7/12 flex flex-col bg-dark-elevated overflow-y-auto scrollbar-hide border-l border-white/5">
          <div className="p-12 md:p-20 space-y-16">
            
            {/* Real-time Analysis Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Sentiment</div>
                  <div className={cn("text-xs font-black uppercase", article.sentiment === 'Positive' ? 'text-green-500' : 'text-red-500')}>
                    {article.sentiment}
                  </div>
               </div>
               <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Viral Reach</div>
                  <div className="text-xs font-black uppercase text-orange-500">{article.viralScore}%</div>
               </div>
               <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl col-span-2">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Source Integrity</div>
                  <div className="flex items-center gap-2">
                     <Shield size={12} className="text-blue-500" />
                     <span className="text-xs font-black uppercase text-white">Verified RSS Node</span>
                  </div>
               </div>
            </div>

            {/* AI Synthesized Intelligence (English/Hindi) */}
            <div className="space-y-12">
               <div className="relative p-12 bg-white/[0.02] border border-white/5 rounded-[3.5rem] overflow-hidden">
                  <div className="absolute top-0 right-0 p-8">
                     <Languages size={40} className="text-accent/10" />
                  </div>
                  <h3 className="flex items-center gap-3 text-accent font-black uppercase text-xs tracking-widest mb-10 italic-human">
                    <Zap size={18} /> Deep Synthesis Overview
                  </h3>
                  
                  <div className="space-y-8">
                     <div>
                        <div className="text-[9px] font-black uppercase text-slate-600 mb-2">Intelligence Stream</div>
                        <p className="text-xl text-white leading-relaxed font-bold tracking-tight">
                           {article.description}
                        </p>
                     </div>
                     
                     <div className="pt-8 border-t border-white/5">
                        <div className="text-[9px] font-black uppercase text-orange-600 mb-2">Hindi Synthesis • AI Summary</div>
                        <p className="text-xl text-slate-100 font-bold leading-relaxed">
                           {article.summaryHindi || "पटल पर विश्लेषण उपलब्ध है।"}
                        </p>
                     </div>
                  </div>
               </div>

               <div className="prose prose-invert max-w-none">
                  <div className="text-slate-300 text-lg leading-relaxed font-medium space-y-10">
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                  </div>
               </div>
            </div>

            {/* Interaction Layer */}
            <div className="pt-20 border-t border-white/5 space-y-10">
               <div className="flex flex-wrap gap-3">
                  {article.tags.map(tag => (
                    <span key={tag} className="px-6 py-2.5 bg-white/[0.03] rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest border border-white/5 hover:text-white hover:border-accent cursor-pointer transition-all">#{tag}</span>
                  ))}
               </div>

               <div className="flex gap-4">
                  <button 
                    onClick={onToggleSave}
                    className={cn(
                      "flex-1 py-5 rounded-[2rem] flex items-center justify-center gap-4 transition-all font-black uppercase text-[10px] tracking-widest border shadow-2xl",
                      isSaved ? "bg-accent border-accent text-white" : "bg-white/[0.03] border-white/10 text-white hover:bg-white/10"
                    )}
                  >
                    <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} /> {isSaved ? "Intel Secured" : "Secure Intel"}
                  </button>
                  <button onClick={() => share('twitter')} className="w-20 py-5 bg-white/[0.03] border border-white/10 rounded-[2rem] flex items-center justify-center hover:bg-white/10 text-white transition-all"><Share2 size={20} /></button>
               </div>
            </div>

            {/* Metadata Footer */}
            <div className="py-12 bg-black/20 rounded-[3rem] px-10 flex items-center justify-between opacity-40">
               <div className="flex items-center gap-8">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Process ID</span>
                     <span className="text-[10px] font-black text-white">{article.id.substring(0, 8)}</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Protocol</span>
                     <span className="text-[10px] font-black text-white">TLS/RSS/AI</span>
                  </div>
               </div>
               <div className="flex items-center gap-2 text-accent">
                  <Link2 size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Origin Authenticated</span>
               </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
