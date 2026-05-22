import React from 'react';
import { motion } from 'framer-motion';

export const Upgrade = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full pt-10 pb-20">
      {/* Hero Branding */}
      <div className="text-center mb-12 max-w-lg z-10">
        <span className="inline-block px-3 py-1 rounded-full bg-cyber-purple/20 text-cyber-purple text-xs uppercase tracking-widest mb-4 border border-cyber-purple/30">
          Elevate Your Vision
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-none tracking-tighter">
          Unleash the <span className="text-accent">Pulse.</span>
        </h2>
        <p className="text-slate-400 px-4 max-w-md mx-auto">
          Experience the ultimate cinematic intelligence tool with precision-engineered features for the modern film connoisseur.
        </p>
      </div>

      {/* Premium Plan Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md group z-10"
      >
        {/* Animated Background Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-accent to-cyber-purple rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

        <div className="relative bg-dark-elevated/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center overflow-hidden">
          {/* Badge */}
          <div className="absolute top-0 right-0 mt-6 mr-6">
            <span className="bg-accent text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-lg font-bold shadow-lg shadow-accent/20">
              MOST POPULAR
            </span>
          </div>

          <div className="mb-8 w-full mt-4">
            <h3 className="text-2xl font-black text-white mb-2 uppercase italic-human">Premium Plan</h3>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-black text-accent">$9.99</span>
              <span className="text-slate-400 font-bold">/mo</span>
            </div>
          </div>

          {/* Features List */}
          <ul className="w-full space-y-6 mb-10 text-left">
            {[
              { icon: "⚡", text: "Zero-Latency Scraping" },
              { icon: "🚫", text: "Ad-free Experience" },
              { icon: "🎯", text: "Exclusive Deep Reviews" },
              { icon: "🔔", text: "Priority Notification Alerts" }
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-4 group/item">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center border border-accent/30 group-hover/item:scale-110 transition-transform text-accent">
                  {feature.icon}
                </div>
                <span className="text-slate-200 font-medium">{feature.text}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <button className="w-full bg-accent text-white py-4 rounded-2xl text-xl font-black uppercase tracking-wider shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] hover:brightness-110 transition-all duration-300 active:scale-95 transform">
            Upgrade Now
          </button>

          <p className="mt-6 text-xs text-slate-500 font-bold uppercase tracking-widest">
            Cancel anytime. No hidden fees.
          </p>
        </div>
      </motion.div>

      {/* Secondary Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 w-full max-w-md grid grid-cols-2 gap-4 z-10"
      >
        <div className="bg-dark-elevated/50 backdrop-blur-sm p-4 rounded-2xl flex flex-col items-center justify-center border border-white/5 opacity-80 hover:opacity-100 hover:border-white/20 transition-all cursor-pointer">
          <span className="text-xs text-slate-400 uppercase tracking-widest mb-1 font-bold">Standard</span>
          <span className="text-2xl font-black text-white">$4.99</span>
        </div>
        <div className="bg-dark-elevated/50 backdrop-blur-sm p-4 rounded-2xl flex flex-col items-center justify-center border border-white/5 opacity-80 hover:opacity-100 hover:border-white/20 transition-all cursor-pointer">
          <span className="text-xs text-slate-400 uppercase tracking-widest mb-1 font-bold">Lifetime</span>
          <span className="text-2xl font-black text-white">$199</span>
        </div>
      </motion.div>
    </div>
  );
};
