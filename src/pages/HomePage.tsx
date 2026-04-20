import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProcessSteps from '@/components/ProcessSteps';
import { RequirementCards, Badge, Button, HologramTag } from '@/components/ui';
import { verificationStatusConfig } from '@/lib/configs';
import { useMyCitasStore } from '@/store/myCitasStore';
import { AlertCircle, Search, MapPin, Phone, Clock, ArrowRight, CheckCircle, XCircle, AlertTriangle, Hourglass } from 'lucide-react';
import { motion } from 'framer-motion';

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { citas, fetchCitas, startPolling, stopPolling } = useMyCitasStore();
  const [searchPlate, setSearchPlate] = useState('');
  const [searchResult, setSearchResult] = useState<{ found: boolean; cita?: typeof citas[0] } | null>(null);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
  
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [location]);

  // Polling: fetch citas every 30s to keep status in sync
  useEffect(() => {
    fetchCitas();
    startPolling(30000);
    return () => stopPolling();
  }, [fetchCitas, startPolling, stopPolling]);

  // Determine the active verification step from the most recent non-cancelled cita
  const activeCita = citas.find(c => c.status !== 'cancelada');
  const activeVerifStep = activeCita?.verificationStatus || null;

  // Map verification status to timeline step index
  const stepIndexMap: Record<string, number> = {
    sin_verificar: 0,
    pendiente: 1,  // mapped to "Pendiente" (index 1)
    en_proceso: 2,
    aprobada: 3,   // fork top
    rechazada: 4,  // fork bottom
  };  
  const activeStepIndex = activeVerifStep ? (stepIndexMap[activeVerifStep] ?? null) : null;

  const requirements = [
    'Tarjeta de circulación vigente (original y copia)',
    'Constancia de la verificación anterior (holograma)',
    'Factura o carta factura (solo para autos nuevos o cambios de propietario)',
    'Identificación oficial (INE, pasaporte, licencia)',
    'Estar al corriente: No tener multas de tránsito, adeudos de tenencia o refrendo',
  ];


  const handleComplete = () => {
    navigate('/booking');
  };

  const handleSearch = () => {
    const normalizedPlate = searchPlate.toUpperCase().trim();
    
    if (!normalizedPlate) return;

    // Use exact match instead of includes for privacy/security
    const found = citas.find(c => c.vehicle.toUpperCase() === normalizedPlate);
    setSearchResult(found ? { found: true, cita: found } : { found: false });
  };

  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Header />
      <main className="flex-grow">
        <Hero />
        
        <section id="requisitos" className="scroll-mt-28 py-20 bg-gradient-to-b from-[var(--color-bg-card)] to-[var(--color-bg-page)]">
          <div className="container mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-black text-primary mb-4">
                  ¿Qué necesitas para verificar?
                </h2>
                <p className="text-lg text-secondary">
                  Prepárate con estos documentos antes de tu cita
                </p>
              </div>
              <RequirementCards 
                requirements={requirements}
                onComplete={handleComplete}
              />
            </motion.div>
          </div>
        </section>

        <section id="estados" className="scroll-mt-28 py-20 bg-white dark:bg-zinc-900 overflow-hidden">
          <div className="container mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-5xl mx-auto"
            >
              <div className="text-center mb-14">
                <h2 className="text-3xl md:text-4xl font-black text-primary mb-4">
                  ¿Cómo avanza tu Verificación?
                </h2>
                <p className="text-lg text-secondary max-w-xl mx-auto">
                  Así es el recorrido oficial de tu trámite, desde que agendas hasta obtener tu resultado.
                </p>
                {activeCita && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border border-red-200 dark:border-red-900/40"
                  >
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                    </span>
                    <span className="text-sm font-bold text-red-700 dark:text-red-400">
                      Sincronizado con tu cita: <span className="uppercase">{activeCita.vehicle}</span>
                    </span>
                    <span className="text-[10px] font-black text-red-500/60 uppercase tracking-widest">En Vivo</span>
                  </motion.div>
                )}
              </div>

              {/* Desktop Timeline */}
              <div className="hidden md:block">
                {/* Main flow: 3 linear steps */}
                <div className="flex items-start justify-center gap-0 mb-2">
                  {[
                    { icon: Clock, label: 'Sin Verificar', desc: 'Cita agendada, aún no presentas tu vehículo.', color: 'slate', bg: 'bg-slate-100 dark:bg-zinc-800', border: 'border-slate-200 dark:border-zinc-700', text: 'text-slate-600 dark:text-zinc-300', iconColor: 'text-slate-500' },
                    { icon: Hourglass, label: 'Pendiente', desc: 'Tu vehículo está en el verificentro, en espera de revisión.', color: 'amber', bg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-200 dark:border-amber-800/40', text: 'text-amber-700 dark:text-amber-400', iconColor: 'text-amber-500' },
                    { icon: AlertTriangle, label: 'En Proceso', desc: 'El técnico está realizando la revisión de emisiones.', color: 'blue', bg: 'bg-blue-50 dark:bg-blue-950/20', border: 'border-blue-200 dark:border-blue-800/40', text: 'text-blue-700 dark:text-blue-400', iconColor: 'text-blue-500' },
                  ].map((step, i) => {
                    const Icon = step.icon;
                    return (
                      <div key={i} className="flex items-center">
                        <motion.div
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.15, duration: 0.4 }}
                          className={`flex flex-col items-center w-44 p-5 rounded-3xl border-2 shadow-sm transition-all duration-500 ${
                            activeStepIndex === i
                              ? `${step.bg} ${step.border} ring-4 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 ${
                                  i === 0 ? 'ring-slate-300' : i === 1 ? 'ring-amber-300' : 'ring-blue-300'
                                } scale-105`
                              : activeStepIndex !== null && activeStepIndex > i
                                ? `${step.bg} ${step.border} opacity-50`
                                : `${step.bg} ${step.border}`
                          }`}
                        >
                          <div className="relative mb-3">
                            {activeStepIndex === i && (
                              <span className={`absolute inset-0 rounded-full animate-ping opacity-25 ${
                                i === 0 ? 'bg-slate-400' : i === 1 ? 'bg-amber-400' : 'bg-blue-400'
                              }`} />
                            )}
                            <div className={`w-14 h-14 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center shadow-inner`}>
                              <Icon className={`w-7 h-7 ${step.iconColor}`} />
                            </div>
                          </div>
                          <p className={`font-black text-sm uppercase tracking-wide ${step.text} text-center mb-1`}>{step.label}</p>
                          <p className="text-[10px] text-slate-400 dark:text-zinc-500 text-center leading-tight">{step.desc}</p>
                        </motion.div>

                        {/* Arrow between nodes */}
                        {i < 2 && (
                          <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 + 0.3, duration: 0.3 }}
                            className="flex items-center origin-left"
                          >
                            <div className="w-10 h-0.5 bg-gradient-to-r from-slate-300 to-slate-400 dark:from-zinc-600 dark:to-zinc-500" />
                            <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-t-transparent border-b-transparent border-l-slate-400 dark:border-l-zinc-500" style={{ borderLeftWidth: 8 }} />
                          </motion.div>
                        )}
                      </div>
                    );
                  })}

                  {/* Fork: two arrows going down-right */}
                  <div className="flex flex-col items-start ml-1 gap-3 mt-0">
                    {/* Top branch: Aprobada */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                      className="flex items-center gap-2"
                    >
                      <svg width="48" height="28" viewBox="0 0 48 28" className="shrink-0">
                        <path d="M0 14 Q24 14 48 4" stroke="#22c55e" strokeWidth="2" fill="none" strokeDasharray="4 2" />
                        <polygon points="44,1 48,4 44,7" fill="#22c55e" />
                      </svg>
                      <div className={`flex flex-col items-center p-4 w-44 rounded-3xl bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800/40 shadow-sm transition-all duration-500 ${
                        activeStepIndex === 3 ? 'ring-4 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 ring-green-300 scale-105' : activeStepIndex === 4 ? 'opacity-40' : ''
                      }`}>
                        <div className="relative mb-2">
                          {activeStepIndex === 3 && (
                            <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-25" />
                          )}
                          <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          </div>
                        </div>
                        <p className="font-black text-sm text-green-700 dark:text-green-400 uppercase tracking-wide text-center mb-1">Aprobada ✓</p>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500 text-center">Tu vehículo cumplió con los estándares de emisiones.</p>
                      </div>
                    </motion.div>

                    {/* Bottom branch: Rechazada */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.75, duration: 0.4 }}
                      className="flex items-center gap-2"
                    >
                      <svg width="48" height="28" viewBox="0 0 48 28" className="shrink-0">
                        <path d="M0 14 Q24 14 48 24" stroke="#ef4444" strokeWidth="2" fill="none" strokeDasharray="4 2" />
                        <polygon points="44,21 48,24 44,27" fill="#ef4444" />
                      </svg>
                      <div className={`flex flex-col items-center p-4 w-44 rounded-3xl bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800/40 shadow-sm transition-all duration-500 ${
                        activeStepIndex === 4 ? 'ring-4 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 ring-red-300 scale-105' : activeStepIndex === 3 ? 'opacity-40' : ''
                      }`}>
                        <div className="relative mb-2">
                          {activeStepIndex === 4 && (
                            <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-25" />
                          )}
                          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-600" />
                          </div>
                        </div>
                        <p className="font-black text-sm text-red-700 dark:text-red-400 uppercase tracking-wide text-center mb-1">Rechazada ✗</p>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500 text-center">Requiere ajustes. Puedes reagendar sin costo adicional.</p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Mobile: vertical list */}
              <div className="md:hidden space-y-3">
                {[
                  { icon: Clock, label: 'Sin Verificar', desc: 'Cita agendada, vehículo aún no presentado.', bg: 'bg-slate-50 dark:bg-zinc-800', border: 'border-slate-200 dark:border-zinc-700', text: 'text-slate-600 dark:text-zinc-300', iconColor: 'text-slate-500', dot: 'bg-slate-400' },
                  { icon: Hourglass, label: 'Pendiente', desc: 'Tu vehículo está en el verificentro.', bg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-200', text: 'text-amber-700 dark:text-amber-400', iconColor: 'text-amber-500', dot: 'bg-amber-400' },
                  { icon: AlertTriangle, label: 'En Proceso', desc: 'El técnico realiza la revisión de emisiones.', bg: 'bg-blue-50 dark:bg-blue-950/20', border: 'border-blue-200', text: 'text-blue-700 dark:text-blue-400', iconColor: 'text-blue-500', dot: 'bg-blue-500' },
                  { icon: CheckCircle, label: 'Aprobada ✓', desc: 'Vehículo aprobado. Cumple con los estándares.', bg: 'bg-green-50 dark:bg-green-950/20', border: 'border-green-200', text: 'text-green-700 dark:text-green-400', iconColor: 'text-green-600', dot: 'bg-green-500' },
                  { icon: XCircle, label: 'Rechazada ✗', desc: 'Requiere ajustes. Puedes reagendar.', bg: 'bg-red-50 dark:bg-red-950/20', border: 'border-red-200', text: 'text-red-700 dark:text-red-400', iconColor: 'text-red-600', dot: 'bg-red-500' },
                ].map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.35 }}
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${step.bg} ${step.border} ${
                        activeStepIndex === i ? 'ring-2 ring-offset-1 ring-offset-white dark:ring-offset-zinc-900 ring-red-300 scale-[1.02]' : activeStepIndex !== null && activeStepIndex > i && i < 3 ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="relative shrink-0">
                        {activeStepIndex === i && <span className={`absolute inset-0 rounded-full animate-ping opacity-30 ${
                          i === 0 ? 'bg-slate-400' : i === 1 ? 'bg-amber-400' : i === 2 ? 'bg-blue-400' : i === 3 ? 'bg-green-400' : 'bg-red-400'
                        }`} />}
                        <div className={`w-12 h-12 rounded-xl ${step.bg} border ${step.border} flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${step.iconColor}`} />
                        </div>
                      </div>
                      <div>
                        <p className={`font-black text-sm uppercase tracking-wider ${step.text}`}>{step.label}</p>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{step.desc}</p>
                      </div>
                      <div className={`ml-auto w-2 h-2 rounded-full shrink-0 ${step.dot}`} />
                    </motion.div>
                  );
                })}
              </div>

            </motion.div>
          </div>
        </section>

        <ProcessSteps />

        <section id="citas" className="scroll-mt-28 py-20 bg-card">
          <div className="container mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-black text-primary mb-4">
                  Busca tu Cita
                </h2>
                <p className="text-lg text-secondary">
                  Ingresa tu número de placa para verificar el estado de tu verificación
                </p>
              </div>
                             <div className="bg-gradient-to-br from-[var(--color-bg-page)] to-[var(--color-bg-card)] p-8 rounded-3xl shadow-lg border border-border">
                  <div className="flex flex-col gap-4">
                    <div className="relative">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Número de Placa</label>
                      <input 
                        type="text" 
                        placeholder="ABC-1234" 
                        value={searchPlate}
                        onChange={(e) => setSearchPlate(e.target.value)}
                        className="w-full px-5 py-4 border-2 border-border rounded-2xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none text-lg font-medium bg-white dark:bg-zinc-900 transition-all text-center uppercase tracking-widest"
                      />
                    </div>
                    
                    <Button variant="primary" size="lg" onClick={handleSearch} className="w-full h-14 text-lg shadow-red-500/20 shadow-lg">
                      <Search className="w-5 h-5 mr-2" /> Consultar Estatus
                    </Button>
                  </div>
                
                {searchResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    {searchResult.found && searchResult.cita ? (
                      <div className="bg-white dark:bg-zinc-900 border-2 border-green-200 dark:border-green-900/40 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                        {/* Decorative watermark */}
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                          <CheckCircle className="w-32 h-32 text-green-600" />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-zinc-800">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-green-100 dark:bg-green-950 rounded-2xl flex items-center justify-center">
                              <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">Cita Encontrada</h4>
                              <p className="text-sm text-slate-500 font-medium">Información validada oficialmente</p>
                            </div>
                          </div>
                          <Badge variant="success" className="text-xs px-4 py-2 rounded-xl border border-green-200 uppercase tracking-widest font-black">ACTIVA</Badge>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                          <div className="space-y-1">
                             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Placa</p>
                             <div className="flex items-center gap-2">
                               <p className="font-bold text-slate-900 dark:text-white text-lg uppercase">{searchResult.cita.vehicle}</p>
                                {searchResult.cita.hologram && (
                                  <HologramTag hologram={searchResult.cita.hologram} className="ml-2" />
                                )}
                             </div>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Folio</p>
                             <p className="font-black text-red-600 dark:text-red-500 text-lg">{searchResult.cita.folio}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Fecha</p>
                             <p className="font-bold text-slate-900 dark:text-white text-lg">{searchResult.cita.date}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Horario</p>
                             <p className="font-bold text-slate-900 dark:text-white text-lg">{searchResult.cita.time}</p>
                          </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-2xl p-4 flex items-center justify-between mb-8">
                          <div className="flex items-center gap-3 min-w-0">
                            <MapPin className="w-5 h-5 text-red-600 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Centro de Verificación</p>
                              <p className="font-bold text-slate-700 dark:text-zinc-200 truncate">{searchResult.cita.center} – {searchResult.cita.address}</p>
                            </div>
                          </div>
                          
                          {searchResult.cita.verificationStatus && (
                            <div className="flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-zinc-700">
                              {(() => {
                                const verif = verificationStatusConfig[searchResult.cita.verificationStatus] || verificationStatusConfig.sin_verificar;
                                const VerifIcon = verif.icon;
                                return (
                                  <>
                                    <div className={`p-2 rounded-lg ${
                                      verif.variant === 'success' ? 'bg-green-100 text-green-600' :
                                      verif.variant === 'warning' ? 'bg-amber-100 text-amber-600' :
                                      verif.variant === 'error' ? 'bg-red-100 text-red-600' :
                                      verif.variant === 'info' ? 'bg-blue-100 text-blue-600' :
                                      'bg-slate-100 text-secondary'
                                    }`}>
                                      <VerifIcon className="w-4 h-4" />
                                    </div>
                                    <div className="hidden sm:block">
                                      <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Estatus Vehicular</p>
                                      <p className={`text-xs font-bold uppercase ${
                                        verif.variant === 'success' ? 'text-green-600' :
                                        verif.variant === 'warning' ? 'text-amber-600' :
                                        verif.variant === 'error' ? 'text-red-600' :
                                        verif.variant === 'info' ? 'text-blue-600' :
                                        'text-secondary'
                                      }`}>{verif.label}</p>
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-center">
                          <Button 
                            variant="primary"
                            onClick={() => navigate('/mis-citas')}
                            className="w-full sm:w-auto px-10"
                          >
                            Ver Detalles y Comprobante <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-900/50 rounded-2xl p-6">
                        <div className="flex items-center gap-3">
                          <AlertCircle className="w-6 h-6 text-amber-600" />
                          <span className="text-amber-800 font-medium">No se encontró ninguna cita con esa placa</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16 mt-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center font-black">
                  CDMX
                </div>
                <span className="font-bold text-xl">Gobierno de la CDMX</span>
              </div>
              <p className="text-slate-400">Secretaría del Medio Ambiente</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-slate-400">
                &copy; 2026 Gobierno de la Ciudad de México.<br/>Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
