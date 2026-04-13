import React, { useState, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, MapPin, FileText, ClipboardList, Plus } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { Button } from './ui';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80; // Compensar el header fijo
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
    // Si no está en '/', el href estándar ya funcionará (/#id) o router lo manejará
    if (isMenuOpen) setIsMenuOpen(false);
  };
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleOpenMenu = () => {
    setIsMenuOpen(true);
    setTimeout(() => closeButtonRef.current?.focus(), 50);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCloseMenu();
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-border shadow-sm py-3 transition-all duration-300`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <Logo size="md" />

          <nav className="hidden lg:flex items-center gap-6">
            <ul className="flex items-center gap-6">
              <li>
                <a 
                  href="/#citas" 
                  onClick={(e) => scrollToSection(e, 'citas')}
                  className="group flex items-center gap-2 py-2 px-3 rounded-xl text-sm font-bold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-zinc-800/50 transition-all"
                >
                  <Calendar className="w-4 h-4 text-slate-400 dark:text-zinc-500 group-hover:text-[#d41111] transition-colors" /> 
                  <span>Citas</span>
                </a>
              </li>
              <li>
                <a 
                  href="/#requisitos" 
                  onClick={(e) => scrollToSection(e, 'requisitos')}
                  className="group flex items-center gap-2 py-2 px-3 rounded-xl text-sm font-bold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-zinc-800/50 transition-all"
                >
                  <FileText className="w-4 h-4 text-slate-400 dark:text-zinc-500 group-hover:text-[#d41111] transition-colors" /> 
                  <span>Requisitos</span>
                </a>
              </li>
              <li>
                <a 
                  href="/#verificentros" 
                  onClick={(e) => scrollToSection(e, 'verificentros')}
                  className="group flex items-center gap-2 py-2 px-3 rounded-xl text-sm font-bold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-zinc-800/50 transition-all"
                >
                  <MapPin className="w-4 h-4 text-slate-400 dark:text-zinc-500 group-hover:text-[#d41111] transition-colors" /> 
                  <span>Verificentros</span>
                </a>
              </li>
            </ul>

            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-border">
              <ThemeToggle />
              <Button 
                variant="outline" 
                size="md"
                onClick={() => navigate('/mis-citas')}
                className="text-[#d41111] border-[#d41111] bg-transparent"
              >
                <ClipboardList className="w-4 h-4" />
                Mi Cita
              </Button>
              <Button 
                variant="primary" 
                size="md"
                onClick={() => navigate('/booking')}
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Cita</span>
              </Button>
            </div>
          </nav>

          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <Button 
              onClick={() => navigate('/booking')}
              size="sm"
              className="px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Cita</span>
            </Button>
            <button 
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={handleOpenMenu}
              aria-label="Abrir menú"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div 
          ref={menuRef}
          id="mobile-menu"
           role="dialog"
           aria-modal="true"
           aria-label="Menú de navegación"
           className="lg:hidden absolute top-full left-0 w-full bg-card/95 backdrop-blur-xl border-b border-border shadow-lg"
          onKeyDown={handleKeyDown}
        >
          <ul className="py-4 px-6 flex flex-col gap-2">
            <li>
              <Button 
                onClick={() => { navigate('/booking'); handleCloseMenu(); }}
                className="w-full justify-start text-white font-extrabold shadow-md"
              >
                <Plus className="w-5 h-5"/> Nueva Cita
              </Button>
            </li>
             <li>
               <Link to="/mis-citas" className="flex items-center gap-3 p-3 text-slate-900 dark:text-white font-bold hover:bg-slate-100 dark:hover:bg-zinc-800 hover:rounded-xl transition-colors" onClick={handleCloseMenu}>
                 <ClipboardList className="w-5 h-5"/> Mi Cita
               </Link>
             </li>
            <div className="h-px border-border my-2"></div>
             <li>
               <a 
                href="/#citas" 
                onClick={(e) => scrollToSection(e, 'citas')}
                className="flex items-center gap-3 p-3 text-slate-900 dark:text-white font-medium hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
               >
                 <Calendar className="w-5 h-5"/> Buscar Citas
               </a>
             </li>
             <li>
               <a 
                href="/#requisitos" 
                onClick={(e) => scrollToSection(e, 'requisitos')}
                className="flex items-center gap-3 p-3 text-slate-900 dark:text-white font-medium hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
               >
                 <FileText className="w-5 h-5"/> Requisitos para Verificar
               </a>
             </li>
             <li>
               <a 
                href="/#verificentros" 
                onClick={(e) => scrollToSection(e, 'verificentros')}
                className="flex items-center gap-3 p-3 text-slate-900 dark:text-white font-medium hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
               >
                 <MapPin className="w-5 h-5"/> Ubicar Verificentro
               </a>
             </li>
          </ul>
        </div>
      )}

      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 lg:hidden"
          onClick={handleCloseMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
};

export default Header;
