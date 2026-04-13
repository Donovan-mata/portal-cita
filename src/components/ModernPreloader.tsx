import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car } from 'lucide-react';

const ModernPreloader: React.FC = () => {
  const [loadingText, setLoadingText] = useState('Iniciando sistema...');
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    // Ciclo de textos de carga
    const texts = [
      'Calentando motor...',
      'Revisando niveles de emisiones...',
      'Calibrando sensores...',
      'Cargando VerifiCDMX...',
      'Listo para verificar.'
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % texts.length;
      setLoadingText(texts[i]);
    }, 1500);

    // Generador de partículas de humo
    const particleInterval = setInterval(() => {
      setParticles(prev => [...prev.slice(-15), Date.now()]);
    }, 250);

    return () => {
      clearInterval(interval);
      clearInterval(particleInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950 overflow-hidden">
      {/* Luces de fondo (Efecto Bloom) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-orange-600/10 rounded-full blur-[80px]" />

      <div className="relative">
        {/* Partículas de Humo */}
        <div className="absolute right-0 top-1/2">
          <AnimatePresence>
            {particles.map((id) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: -10, y: 10, scale: 0.5 }}
                animate={{ 
                  opacity: [0, 0.4, 0], 
                  x: 100, 
                  y: [10, -20, -40],
                  scale: [0.5, 1.5, 2]
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute w-8 h-8 bg-zinc-400/20 rounded-full blur-md"
              />
            ))}
          </AnimatePresence>
        </div>

        {/* El Auto */}
        <motion.div
          animate={{ 
            y: [0, -2, 0],
            rotate: [0, 0.5, -0.5, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 0.15,
            ease: "linear"
          }}
          className="relative z-10 p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-2xl shadow-black/50"
        >
          <div className="relative">
            <Car className="w-24 h-24 text-red-600" strokeWidth={1.5} />
            {/* Brillo de faro */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-orange-400/50 rounded-full blur-xl" />
          </div>
        </motion.div>

        {/* Escape / Tubo */}
        <div className="absolute bottom-6 -right-1 w-4 h-2 bg-zinc-700 rounded-full" />
      </div>

      {/* Barra de progreso minimalista */}
      <div className="mt-12 w-48 h-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
        <motion.div 
          className="h-full bg-gradient-to-r from-red-600 to-orange-500 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 8, ease: "easeInOut" }}
        />
      </div>

      {/* Texto de Carga */}
      <motion.p
        key={loadingText}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 text-zinc-500 font-bold text-xs uppercase tracking-[0.3em] font-mono"
      >
        {loadingText}
      </motion.p>
      
      {/* Pie de página pequeño */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
        <span className="text-[10px] text-zinc-700 font-black uppercase tracking-widest">Sistema de Verificación CDMX</span>
      </div>
    </div>
  );
};

export default ModernPreloader;
