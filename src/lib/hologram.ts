export interface HologramInfo {
  hologram: string;
  label: string;
  color: string;
  bgClass: string;
  textClass: string;
  badgeClass: string;
  iconBg: string;
  frequency: string;
  description: string;
  tip: string;
}

export const getHologramInfo = (yearStr: string): HologramInfo | null => {
  const year = parseInt(yearStr, 10);
  if (isNaN(year) || yearStr.length < 4) return null;
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;

  if (year < 1980 || year > 2027) return null;

  // Doble Cero: solo modelos 2024–2027
  if (year >= 2024 && year <= 2027) {
    return {
      hologram: '00',
      label: 'Holograma Doble Cero',
      color: 'emerald',
      bgClass: 'from-emerald-500/10 to-emerald-600/5 border-emerald-200 dark:border-emerald-800/40',
      textClass: 'text-emerald-700 dark:text-emerald-400',
      badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      frequency: 'Verificación bienal (cada 2 años)',
      description: 'Tu vehículo es modelo reciente. Aplica para el holograma con menor restricción ambiental.',
      tip: 'Vehículo de baja emisión',
    };
  } else if (age <= 8) {
    return {
      hologram: '0',
      label: 'Holograma Cero',
      color: 'amber',
      bgClass: 'from-amber-500/10 to-amber-600/5 border-amber-200 dark:border-amber-800/40',
      textClass: 'text-amber-700 dark:text-amber-400',
      badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
      iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
      frequency: 'Verificación semestral',
      description: 'Tu vehículo requiere verificación dos veces al año. Circula sin restricciones la mayoría de los días.',
      tip: 'Emisión moderada',
    };
  } else if (age <= 15) {
    return {
      hologram: '1',
      label: 'Holograma Uno',
      color: 'orange',
      bgClass: 'from-orange-500/10 to-orange-600/5 border-orange-200 dark:border-orange-800/40',
      textClass: 'text-orange-700 dark:text-orange-400',
      badgeClass: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
      iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
      frequency: 'Verificación semestral obligatoria',
      description: 'Verificación obligatoria cada 6 meses. Aplica restricción de circulación un día a la semana.',
      tip: 'Restricción parcial',
    };
  } else {
    return {
      hologram: '2',
      label: 'Holograma Dos',
      color: 'violet',
      bgClass: 'from-violet-500/10 to-violet-600/5 border-violet-200 dark:border-violet-800/40',
      textClass: 'text-violet-700 dark:text-violet-400',
      badgeClass: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
      iconBg: 'bg-gradient-to-br from-violet-500 to-violet-600',
      frequency: 'Verificación semestral obligatoria',
      description: 'Vehículo con más de 15 años de antigüedad. Restricción de circulación un día a la semana y un sábado al mes.',
      tip: 'Restricción amplia',
    };
  }
};
