import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Bookmark, Share2, Sparkles, Clock, User, Facebook, Twitter, Link2, Flame } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { GoogleGenAI } from "@google/genai";
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
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const summarize = async () => {
    if (summary) return;
    setIsSummarizing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Please summarize this news article in 3-4 bullet points. Focus on key details:
          Title: ${article.title}
          Content: ${article.content}`,
      });
      setSummary(response.text || "Failed to generate summary.");
    } catch (error) {
      console.error("Summarization failed:", error);
      setSummary("Error generating summary. Please try again later.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const share = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this news: ${article.title}`;
    
    switch(platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] glass rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header Controls */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button 
            onClick={onToggleSave}
            className={cn(
              "p-2.5 rounded-full backdrop-blur-md border border-white/10 transition-all",
              isSaved ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20" : "bg-black/40 text-white hover:bg-black/60"
            )}
          >
            <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={onClose}
            className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 scrollbar-hide">
          {/* Trending Progress Bar */}
          <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-orange-500 z-20 transition-all duration-1000" style={{ width: `${article.viralScore}%` }} />
          
          {/* Main Image */}
          <div className="relative aspect-video">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
               <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-orange-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/10 mb-3 inline-block">
                {article.category}
              </span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2 leading-tight">
                {article.title}
              </h2>
              <div className="flex items-center gap-4 text-slate-300 text-[10px] font-bold tracking-widest uppercase">
                <span className="flex items-center gap-1.5"><User size={14} className="text-purple-400" /> {article.author}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} /> {formatDate(article.publishedAt)}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            {article.viralScore > 80 && (
              <div className="mb-8 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center gap-4">
                <Flame size={24} className="text-orange-500" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-orange-400">Viral Alert</h4>
                  <p className="text-xs text-orange-200">This story is trending with a viral score of {article.viralScore}/100.</p>
                </div>
              </div>
            )}
            <div className="flex flex-col md:flex-row gap-8">
              {/* Main Text */}
              <div className="flex-1 space-y-6">
                <div className="prose prose-invert prose-amber max-w-none text-slate-300 leading-relaxed text-lg">
                  {article.content}
                </div>

                {/* Share Section */}
                <div className="pt-8 border-t border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Share this story</p>
                  <div className="flex gap-3">
                    <button onClick={() => share('twitter')} className="p-3 glass rounded-xl hover:bg-white/10 transition-colors"><Twitter size={20} /></button>
                    <button onClick={() => share('facebook')} className="p-3 glass rounded-xl hover:bg-white/10 transition-colors"><Facebook size={20} /></button>
                    <button onClick={() => share('copy')} className="p-3 glass rounded-xl hover:bg-white/10 transition-colors"><Link2 size={20} /></button>
                  </div>
                </div>
              </div>

              {/* Sidebar - AI Tools */}
              <div className="w-full md:w-72 space-y-6">
                <div className="glass-dark rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4 text-purple-400">
                    <Sparkles size={18} />
                    <h4 className="font-bold text-sm uppercase tracking-widest">AI Summary</h4>
                  </div>
                  
                  {summary ? (
                    <div className="text-sm text-slate-300 leading-relaxed glass-dark p-4 rounded-xl border border-white/5">
                      <ReactMarkdown>{summary}</ReactMarkdown>
                    </div>
                  ) : (
                    <button 
                      onClick={summarize}
                      disabled={isSummarizing}
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 group shadow-lg shadow-purple-500/20"
                    >
                      {isSummarizing ? (
                        "Synthesizing..."
                      ) : (
                        <>
                          <Sparkles size={16} className="group-hover:animate-pulse" />
                          Summarize News
                        </>
                      )}
                    </button>
                  )}
                  
                  <p className="text-[10px] text-slate-500 mt-4 text-center font-medium opacity-60">
                    AI insights generated instantly.
                  </p>
                </div>

                <div className="glass-dark rounded-2xl p-6">
                   <h4 className="font-black text-xs mb-4 uppercase tracking-widest text-slate-400">Related Tags</h4>
                   <div className="flex flex-wrap gap-2">
                     {article.tags.map(tag => (
                       <span key={tag} className="px-3 py-1 glass-dark rounded-lg text-[10px] font-bold text-slate-500 border border-white/5 uppercase tracking-widest hover:text-purple-400 transition-colors">
                         #{tag}
                       </span>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
