import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, FileText, CreditCard, Car, User, AlertCircle, Calendar, ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface RequirementCardsProps {
  requirements: string[];
  onComplete: () => void;
  className?: string;
}

const requirementIcons = [
  { icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { icon: Car, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  { icon: User, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
];

export const RequirementCards: React.FC<RequirementCardsProps> = ({ 
  requirements,
  onComplete,
  className = '' 
}) => {
  const [checked, setChecked] = useState<boolean[]>(new Array(requirements.length).fill(false));

  const handleToggle = (index: number) => {
    const newChecked = [...checked];
    newChecked[index] = !newChecked[index];
    setChecked(newChecked);
  };

  const allChecked = checked.every(Boolean);
  const completedCount = checked.filter(Boolean).length;
  const progress = (completedCount / requirements.length) * 100;

  return (
    <div className={`space-y-10 ${className}`}>
      {/* Grid de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requirements.map((label, index) => {
          const config = requirementIcons[index % requirementIcons.length];
          const Icon = config.icon;
          const isDone = checked[index];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <button
                onClick={() => handleToggle(index)}
                className={`w-full h-full text-left p-6 rounded-[32px] border-2 transition-all duration-500 glass-card relative overflow-hidden ${
                  isDone 
                    ? 'border-emerald-500/50 bg-emerald-50/10 dark:bg-emerald-900/10' 
                    : 'border-slate-100 dark:border-zinc-800 hover:border-primary/30'
                }`}
              >
                {/* Efecto de resplandor de fondo en hover */}
                <div className={`absolute -inset-24 bg-gradient-to-br from-primary/5 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${isDone ? 'bg-emerald-500' : config.bg} flex items-center justify-center transition-colors duration-500 shadow-lg shadow-black/5`}>
                      <AnimatePresence mode="wait">
                        {isDone ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                          >
                            <Check className="w-7 h-7 text-white" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="icon"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                          >
                            <Icon className={`w-7 h-7 ${config.color}`} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                      isDone ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200 dark:border-zinc-700'
                    }`}>
                      {isDone && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>

                  <h4 className={`text-lg font-black leading-tight tracking-tight mb-2 ${
                    isDone ? 'text-emerald-900 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                  }`}>
                    {label.includes('(') ? label.split('(')[0] : label}
                  </h4>
                  
                  {label.includes('(') && (
                    <p className="text-sm text-slate-500 dark:text-zinc-500 font-medium">
                      ({label.split('(')[1]}
                    </p>
                  )}
                  
                  {index === 4 && label.includes(':') && (
                     <p className="text-sm text-slate-500 dark:text-zinc-500 font-medium mt-auto">
                       {label.split(':')[1]}
                     </p>
                  )}
                </div>

                {/* Línea decorativa inferior con progreso */}
                <div className={`absolute bottom-0 left-0 h-1 transition-all duration-700 ${
                  isDone ? 'w-full bg-emerald-500' : 'w-0 bg-primary/20'
                }`} />
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Footer de la sección con progreso total */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="max-w-2xl mx-auto bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-[32px] p-8 border border-slate-200 dark:border-zinc-800 shadow-xl"
      >
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-100 dark:text-zinc-800"
              />
              <motion.circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                animate={{ strokeDashoffset: 251.2 - (251.2 * progress) / 100 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-emerald-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{completedCount}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">de {requirements.length}</span>
            </div>
          </div>

          <div className="flex-grow text-center md:text-left">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              {allChecked ? '¡Todo listo para tu verificación!' : 'Validación de Documentos'}
            </h3>
            <p className="text-slate-500 dark:text-zinc-400 font-medium text-sm">
              {allChecked 
                ? 'Has confirmado tener todos los requisitos necesarios. Ahora puedes proceder a agendar tu cita.' 
                : 'Asegúrate de marcar cada documento que tengas preparado para evitar contratiempos en el verificentro.'}
            </p>
          </div>

          <div className="flex-shrink-0 w-full md:w-auto">
            <Button
              onClick={onComplete}
              disabled={!allChecked}
              variant={allChecked ? 'primary' : 'outline'}
              size="lg"
              className={`w-full md:w-auto h-16 px-10 rounded-2xl font-black text-lg shadow-2xl transition-all duration-500 ${
                allChecked 
                  ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' 
                  : 'bg-transparent border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-600'
              }`}
            >
              {allChecked ? (
                <>Continuar <ArrowRight className="w-5 h-5 ml-2" /></>
              ) : (
                <><Calendar className="w-5 h-5 mr-2" /> Agendar Cita</>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
