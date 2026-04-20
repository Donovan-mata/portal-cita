import React from 'react';
import { Clock } from 'lucide-react';
import { Cita } from '@/store/myCitasStore';
import { parseCitaDate } from '@/lib/dateUtils';
import { useCountdown } from '@/hooks/useCountdown';

interface CountdownWidgetProps {
  cita: Cita;
}

export const CountdownWidget: React.FC<CountdownWidgetProps> = ({ cita }) => {
  const target = parseCitaDate(cita.date, cita.time);
  const { days, hours, minutes, seconds, isPast, isUrgent } = useCountdown(target);

  if (cita.status !== 'confirmada' && cita.status !== 'pendiente') return null;

  return (
    <div className={`p-4 rounded-3xl border flex items-center gap-4 ${
      isUrgent 
        ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30' 
        : 'bg-slate-50 dark:bg-zinc-800/40 border-slate-100 dark:border-zinc-700/50'
    }`}>
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${
        isUrgent ? 'bg-red-100 dark:bg-red-900/40 text-red-600' : 'bg-white dark:bg-zinc-800 text-[#d41111]'
      }`}>
        <Clock className={isUrgent ? 'w-5 h-5 animate-pulse' : 'w-5 h-5'} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1">
          {isPast ? 'Cita iniciada' : 'Tu cita inicia en'}
        </p>
        <div className="flex items-baseline gap-1">
          {!isPast ? (
            <>
              {days > 0 && <><span className="text-lg font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">{days}</span><span className="text-[9px] font-bold text-slate-400 mr-1 uppercase">d</span></>}
              <span className="text-lg font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">{String(hours).padStart(2, '0')}</span><span className="text-[9px] font-bold text-slate-400 mr-1">:</span>
              <span className="text-lg font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">{String(minutes).padStart(2, '0')}</span><span className="text-[9px] font-bold text-slate-400 mr-1">:</span>
              <span className="text-lg font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">{String(seconds).padStart(2, '0')}</span>
            </>
          ) : (
             <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Presentarse ahora</span>
          )}
        </div>
      </div>
    </div>
  );
};
