import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Leaf } from 'lucide-react';
import { getHologramInfo } from '@/lib/hologram';

interface HologramBadgeProps {
  yearStr: string;
}

export const HologramBadge: React.FC<HologramBadgeProps> = ({ yearStr }) => {
  const info = getHologramInfo(yearStr);
  if (!info) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, marginTop: 0 }}
      animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="overflow-hidden"
    >
      <div className={`relative p-4 rounded-2xl bg-gradient-to-r ${info.bgClass} border overflow-hidden`}>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_50%_50%,currentColor_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative flex gap-3">
          {/* Icon */}
          <div className={`${info.iconBg} w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shrink-0`}>
            <span className="text-white font-black text-sm tracking-tight">{info.hologram}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-xs font-black uppercase tracking-wider ${info.textClass}`}>
                {info.label}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black ${info.badgeClass}`}>
                {info.hologram}
              </span>
            </div>
            
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed mb-2">
              {info.description}
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/60 dark:bg-zinc-800/60 text-[10px] font-bold text-slate-600 dark:text-zinc-400 border border-slate-100 dark:border-zinc-700/50">
                <Calendar className="w-3 h-3" />
                {info.frequency}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/60 dark:bg-zinc-800/60 text-[10px] font-bold text-slate-600 dark:text-zinc-400 border border-slate-100 dark:border-zinc-700/50">
                <Leaf className="w-3 h-3" />
                {info.tip}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
