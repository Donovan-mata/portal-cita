import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarPickerProps {
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({ selectedDate, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = [];
  const totalDays = daysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);

  // Pad the beginning of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add the actual days
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    const d = new Date(selectedDate + 'T12:00:00');
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  const isPast = (day: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(year, month, day);
    return date < today;
  };

  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-50 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-800/30">
        <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
          {monthNames[month]} <span className="text-slate-400 font-medium">{year}</span>
        </h3>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={handlePrevMonth} 
            className="p-2 rounded-xl hover:bg-white dark:hover:bg-zinc-800 border border-transparent hover:border-slate-200 dark:hover:border-zinc-700 transition-all text-slate-500"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            type="button"
            onClick={handleNextMonth} 
            className="p-2 rounded-xl hover:bg-white dark:hover:bg-zinc-800 border border-transparent hover:border-slate-200 dark:hover:border-zinc-700 transition-all text-slate-500"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 mb-2">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
            <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 py-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} className="p-2" />;
            
            const selected = isSelected(day);
            const today = isToday(day);
            const past = isPast(day);
            const isWeekend = (idx % 7 === 0 || idx % 7 === 6);

            return (
              <motion.button
                whileHover={!past ? { scale: 1.1 } : {}}
                whileTap={!past ? { scale: 0.9 } : {}}
                key={idx}
                type="button"
                disabled={past}
                onClick={() => onDateSelect(formatDate(day))}
                className={`
                  relative h-11 flex items-center justify-center rounded-2xl text-sm font-bold transition-all duration-300
                  ${past ? 'text-slate-200 dark:text-zinc-800 cursor-not-allowed' : ''}
                  ${!past && !selected ? 'text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800' : ''}
                  ${selected ? 'bg-[#d41111] text-white shadow-[0_8px_16px_-4px_rgba(212,17,17,0.4)] z-10' : ''}
                  ${isWeekend && !past && !selected ? 'bg-orange-50/30 dark:bg-orange-950/5' : ''}
                `}
              >
                {today && !selected && (
                  <span className="absolute bottom-1.5 w-1 h-1 bg-[#d41111] rounded-full" />
                )}
                {day}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="p-4 bg-slate-50 dark:bg-zinc-800/50 border-t border-slate-100 dark:border-zinc-800">
        <div className="flex items-center gap-4 justify-center">
            <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#d41111]" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hoy</span>
            </div>
            <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Disponible</span>
            </div>
            <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-zinc-800" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pasado</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPicker;
