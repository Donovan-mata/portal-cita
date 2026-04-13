import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, Check, MapPin, Clock, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative overflow-hidden pt-20 pb-12 md:pt-28 md:pb-20 hero-gradient">
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d41111]/10 rounded-full blur-3xl dark:opacity-50"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#d41111]/10 rounded-full blur-3xl dark:opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d41111]/10 rounded-full blur-3xl dark:opacity-30"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light text-primary font-semibold rounded-full text-sm mb-6"
            >
              <Shield className="w-4 h-4" />
              <span>Verificación Obligatoria 2026</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, scale: 1.15, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-primary mb-6 leading-[1.1]"
            >
              Agenda tu cita de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d41111] to-orange-500">
                verificación vehicular
              </span>
            </motion.h1 >
            
            <p className="text-lg md:text-xl text-secondary mb-4 max-w-xl mx-auto lg:mx-0 leading-relaxed opacity-90">
              Cumple con tus obligaciones ambientales de forma rápida y segura. 
              El proceso toma menos de 3 minutos.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6">
              <Button
                size="lg"
                onClick={() => navigate('/booking')}
                className="w-full sm:w-auto"
              >
                <motion.div
                  animate={{ x: [0, 2, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  <Calendar className="w-5 h-5" />
                </motion.div>
                Agendar Cita
              </Button>
              <a href="#requisitos" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full border-2 border-slate-300 hover:border-red-500">
                  Ver Requisitos 
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </a>
            </div>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm font-medium text-muted">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span>100% Gratuito</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-green-600" />
                </div>
                <span>Confirmación inmediata</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <span>Sin filas</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#d41111] to-orange-500 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-card rounded-3xl shadow-sm dark:shadow-none overflow-hidden border border-border">
                <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 px-6 py-4 flex items-center gap-3 border-b border-border/50">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-14 h-14">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#d41111] to-orange-500 rounded-2xl blur-md opacity-20"></div>
                      <div className="relative w-full h-full bg-gradient-to-br from-[#d41111] via-red-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden border border-white/20">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px]"></div>
                        <Calendar className="w-7 h-7 text-white relative z-10" />
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-[#d41111] font-black mb-0.5">Folio CDMX-2026</div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Nueva Cita</h3>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="p-4 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-700/50 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-zinc-700">
                          <MapPin className="w-4 h-4 text-[#d41111]" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 tracking-wider">Verificentro</p>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">AZ 20 Vallejo</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-700/50 backdrop-blur-sm">
                        <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 tracking-wider mb-1">Fecha</p>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">Mar 16, 2026</p>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-700/50 backdrop-blur-sm">
                        <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 tracking-wider mb-1">Hora</p>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">10:30 AM</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate('/booking')}
                    className="w-full py-4 bg-[#d41111] hover:bg-gradient-to-r hover:from-[#d41111] hover:to-[#f97316] text-white font-bold rounded-xl shadow-sm dark:hover:shadow-[0_0_15px_rgba(212,17,17,0.4)] transition-all flex items-center justify-center gap-2"
                  >
                    Confirmar Cita
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="absolute -bottom-6 -left-6 bg-card p-4 rounded-2xl shadow-sm dark:shadow-none border border-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                 <div>
                   <p className="font-bold text-primary dark:text-white">Cita Confirmada</p>
                   <p className="text-sm text-muted">Te enviaremos un correo</p>
                 </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
