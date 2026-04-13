import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CarFront, Check } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizeMap = {
  sm: { container: 'w-10 h-10', icon: 18, text: 'text-lg' },
  md: { container: 'w-12 h-12', icon: 22, text: 'text-xl' },
  lg: { container: 'w-16 h-16', icon: 28, text: 'text-2xl' },
};

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const sizes = sizeMap[size];
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-3 group cursor-pointer ${className}`}
      aria-label="Ir al inicio - Portal de Citas CDMX"
    >
      <motion.div
        className={`${sizes.container} relative flex items-center justify-center bg-gradient-to-br from-red-600 to-orange-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Círculo de verificación superpuesto */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </div>

        {/* Ícono de coche */}
        <CarFront
          className="text-white"
          style={{ width: sizes.icon, height: sizes.icon }}
          strokeWidth={2}
        />
      </motion.div>

      {showText && (
        <div className="flex flex-col">
          <motion.span
            className={`${sizes.text} font-black bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent leading-tight tracking-tight shadow-sm`}
            whileHover={{ scale: 1.02 }}
          >
            VerifiCDMX
          </motion.span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500/80 dark:text-zinc-500 leading-tight">
            Tu verificación fácil
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
