import { useState, useEffect } from 'react';

export function useCountdown(target: Date | null) {
  const calc = () => {
    if (!target) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, isUrgent: false };
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, isUrgent: false };
    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return { days, hours, minutes, seconds, isPast: false, isUrgent: days === 0 };
  };

  const [state, setState] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setState(calc()), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.getTime()]);

  return state;
}
