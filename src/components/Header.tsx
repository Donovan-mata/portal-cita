import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, MapPin, FileText, ClipboardList, Plus, ChevronRight, Search, CheckCircle, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppointmentStore } from '@/store/appointmentStore';
import { useAuthStore } from '@/store/authStore';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { Button } from './ui';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reset } = useAppointmentStore();
  const { user, signOut } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNewBooking = () => {
    reset();
    navigate('/booking');
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, sectionId: string) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else {
      navigate('/#' + sectionId);
    }
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const handleCloseMenu = () => setIsMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled || isMenuOpen
          ? 'bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-slate-200 dark:border-zinc-800 py-3 shadow-lg shadow-black/5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <Logo size="md" />

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <ul className="flex items-center gap-2">
              {[
                { label: 'Requisitos', id: 'requisitos', icon: FileText },
                { label: 'Estado', id: 'estados', icon: CheckCircle },
                { label: 'Citas', id: 'citas', icon: Calendar },
              ].map((item) => (
                <li key={item.id}>
                  <a 
                    href={`#${item.id}`}
                    onClick={(e) => scrollToSection(e, item.id)}
                    className="group flex items-center gap-2 py-2 px-4 rounded-full text-sm font-bold text-slate-500 dark:text-zinc-400 hover:text-[#d41111] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all"
                  >
                    <item.icon className="w-4 h-4 transition-colors" /> 
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 ml-4 pl-8 border-l border-slate-200 dark:border-zinc-800">
              <ThemeToggle />
              <button
                onClick={(e) => scrollToSection(e as any, 'citas')}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 dark:text-zinc-400 hover:text-[#d41111] dark:hover:text-[#d41111] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors group"
                title="Buscar estatus de cita"
              >
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              {/* TODO: Reactivar auth condicional después */}
              <Button 
                variant="outline" 
                size="md"
                onClick={() => navigate('/mis-citas')}
                className="text-slate-700 dark:text-zinc-200 border-slate-200 dark:border-zinc-700 font-black h-10 px-4"
              >
                <ClipboardList className="w-4 h-4 mr-2 text-[#d41111]" />
                Mis Citas
              </Button>
              <Button 
                variant="primary" 
                size="md"
                onClick={handleNewBooking}
                className="bg-[#d41111] shadow-lg shadow-red-500/20 px-6"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Cita
              </Button>
            </div>
          </nav>

          {/* Mobile Actions Overlay */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={(e) => scrollToSection(e as any, 'citas')}
              className="p-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 shadow-sm"
            >
              <Search size={20} />
            </button>
            <ThemeToggle />
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className={`p-2.5 rounded-2xl transition-all duration-300 ${isMenuOpen ? 'bg-red-50 dark:bg-red-950/30 text-red-600' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Premium Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
            className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-zinc-950 border-b border-slate-100 dark:border-zinc-800 overflow-hidden shadow-2xl"
          >
            <div className="p-6 space-y-6 bg-gradient-to-b from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900/50">
              <div className="grid grid-cols-1 gap-3">
                <Button 
                  onClick={handleNewBooking}
                  className="w-full justify-between h-14 rounded-2xl bg-[#d41111] text-white font-black text-lg px-6 shadow-xl shadow-red-500/20"
                >
                  <span className="flex items-center gap-3"><Plus className="w-6 h-6"/> Agendar Cita</span>
                  <ChevronRight className="w-5 h-5 opacity-50" />
                </Button>
                
                {/* TODO: Reactivar auth condicional después */}
                <Button 
                  variant="outline"
                  onClick={() => { navigate('/mis-citas'); handleCloseMenu(); }}
                  className="w-full justify-between h-14 rounded-2xl border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white font-black text-lg px-6 bg-white dark:bg-zinc-900 shadow-sm"
                >
                  <span className="flex items-center gap-3"><ClipboardList className="w-6 h-6 text-[#d41111]"/> Mis Trámites</span>
                  <ChevronRight className="w-5 h-5 opacity-50" />
                </Button>
              </div>

              <div className="space-y-1">
                <p className="px-3 text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em] mb-3">Información</p>
                {[
                  { label: 'Requisitos y Documentos', id: 'requisitos', icon: FileText },
                  { label: 'Estado de Verificación', id: 'estados', icon: CheckCircle },
                  { label: 'Calendario de Citas', id: 'citas', icon: Calendar },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={(e) => scrollToSection(e, item.id)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white dark:hover:bg-zinc-800 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800/50 flex items-center justify-center group-hover:bg-red-50 dark:group-hover:bg-red-950/20 transition-colors">
                        <item.icon className="w-5 h-5 text-slate-500 dark:text-zinc-400 group-hover:text-[#d41111]" />
                      </div>
                      <span className="text-slate-900 dark:text-zinc-200 font-bold">{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-zinc-700" />
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 text-center">
                <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Portal Oficial de Verificación CDMX · 2026</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
