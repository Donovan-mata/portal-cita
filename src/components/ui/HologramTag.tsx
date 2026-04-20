import React from 'react';
import { getHologramInfo } from '@/lib/hologram';

interface HologramTagProps {
  hologram?: string;
  year?: string;
  showLabel?: boolean;
  className?: string;
}

export const HologramTag: React.FC<HologramTagProps> = ({ 
  hologram, 
  year, 
  showLabel = true,
  className = '' 
}) => {
  // If year is provided, we use the utility to get info. 
  // If only hologram ID is provided, we can either look it up or just use colors.
  // For consistency, we'll try to get it from year if possible, otherwise we infer style from hologram ID.
  
  const info = year ? getHologramInfo(year) : (hologram ? getHologramInfoByCode(hologram) : null);
  
  if (!info) return null;

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shadow-lg shadow-black/5 ${info.iconBg}`}>
        <span className="text-white font-black text-[10px] tracking-tighter">{info.hologram}</span>
      </div>
      {showLabel && (
        <span className="text-[10px] font-black text-slate-500 dark:text-zinc-400 uppercase tracking-tight">Holograma</span>
      )}
    </div>
  );
};

// Helper for when we only have the hologram code (e.g. from DB)
function getHologramInfoByCode(code: string) {
  const mapping: Record<string, any> = {
    '00': { hologram: '00', iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600' },
    '0':  { hologram: '0',  iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600' },
    '1':  { hologram: '1',  iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600' },
    '2':  { hologram: '2',  iconBg: 'bg-gradient-to-br from-violet-500 to-violet-600' },
  };
  return mapping[code] || null;
}
