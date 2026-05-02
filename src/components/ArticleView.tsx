import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Bookmark, Share2, Sparkles, Clock, User, Facebook, Twitter, Link2, Flame, Languages, LineChart, ShoppingCart, Info } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { cn, formatDate } from "@/src/lib/utils";
import type { NewsArticle } from "@/src/types";
import Newsletter from "./Newsletter";

interface Props {
  article: NewsArticle;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent) => void;
}

const AdPlaceholder = ({ className, label = "Advertisement" }: { className?: string; label?: string }) => (
  <div className={cn("bg-slate-900/50 border border-white/5 rounded-2xl flex flex-col items-center justify-center p-4", className)}>
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">{label}</span>
    <div className="w-12 h-1 bg-white/5 rounded-full mb-4" />
    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest text-center px-4">Monetization Ready Zone • AdSense Auto-Fill</p>
  </div>
);

export default function ArticleView({ article, isOpen, onClose, isSaved, onToggleSave }: Props) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

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

  const summarize = async () => {
    if (summary) return;
    setIsSummarizing(true);
    try {
      const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(`Summarize this in 3 punchy bullets: ${article.title}. ${article.description}`);
      setSummary(result.response.text());
    } catch (error) {
      setSummary("AI synthesis unavailable. Please read full story.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const share = (platform: string) => {
    const url = window.location.href;
    const text = article.title;
    if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
    if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert("Intelligence URL Copied");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.98 }}
        className="relative w-full max-w-5xl max-h-[92vh] glass-dark border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row"
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-50 p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all"><X size={20} /></button>

        <div className="md:w-1/2 relative bg-black overflow-hidden">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          <div className="absolute bottom-10 left-10 right-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
              <Flame size={12} /> {article.category}
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tighter mb-6 italic uppercase">{article.title}</h2>
            <div className="flex items-center gap-6 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-2 text-purple-400"><User size={14} /> {article.author}</span>
              <span className="flex items-center gap-2"><Clock size={14} /> {formatDate(article.publishedAt)}</span>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 flex flex-col overflow-y-auto scrollbar-hide">
          <div className="p-10 md:p-14 space-y-10">
            <AdPlaceholder className="h-32 mb-8 bg-gradient-to-br from-purple-500/5 to-orange-500/5 border-dashed border-white/10" />

            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-3xl border border-white/10">
              <div className={cn("w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]", 
                article.sentiment === "Positive" ? "bg-green-400" : article.sentiment === "Negative" ? "bg-red-400" : "bg-blue-400"
              )} />
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Market Sentiment</p>
                <p className="text-xs font-bold text-white uppercase">{article.sentiment} Insight</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Viral Pulse</p>
                <div className="h-1.5 w-16 bg-white/10 rounded-full mt-1 overflow-hidden">
                   <div className="h-full bg-orange-500" style={{ width: `${article.viralScore}%` }} />
                </div>
              </div>
            </div>

            <div className="prose prose-invert prose-white max-w-none">
               <div className="text-slate-300 text-lg leading-relaxed font-medium space-y-6">
                 <ReactMarkdown>{article.content}</ReactMarkdown>
               </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 p-8 rounded-[2rem] space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="flex items-center gap-3 text-white font-black uppercase text-xs tracking-widest italic">
                  <ShoppingCart size={18} className="text-indigo-400" /> Curated Merch
                </h4>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Affiliate Integration</p>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-bold">
                Gear up with limited edition <span className="text-indigo-400">"{article.title}"</span> collectibles.
              </p>
              <button className="w-full py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-indigo-500 hover:text-white transition-all shadow-xl">
                Check Availability on Amazon
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-10 border-t border-white/5">
               {article.tags.map(tag => (
                 <span key={tag} className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-white/5 hover:text-white hover:border-white/20 cursor-pointer">#{tag}</span>
               ))}
            </div>

            <div className="pt-10 flex gap-4">
               <button onClick={() => share('twitter')} className="flex-1 py-4 glass-dark rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all font-black uppercase text-[10px] tracking-widest"><Twitter size={18} /> Tweet</button>
               <button onClick={() => share('copy')} className="flex-1 py-4 glass-dark rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all font-black uppercase text-[10px] tracking-widest"><Link2 size={18} /> Link</button>
            </div>
            
            <AdPlaceholder className="h-60 mt-12" label="Bottom Sponsor Zone" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
