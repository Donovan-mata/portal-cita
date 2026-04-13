import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProcessSteps from '@/components/ProcessSteps';
import { RequirementsChecklist, Badge, Button } from '@/components/ui';
import { verificationCenters } from '@/data/verificationCenters';
import { useMyCitasStore } from '@/store/myCitasStore';
import { AlertCircle, Search, MapPin, Phone, Clock, ArrowRight, CheckCircle, XCircle, AlertTriangle, Hourglass } from 'lucide-react';
import { motion } from 'framer-motion';

function HomePage() {
  const navigate = useNavigate();
  const { citas } = useMyCitasStore();
  const [searchPlate, setSearchPlate] = useState('');
  const [searchFolio, setSearchFolio] = useState('');
  const [searchResult, setSearchResult] = useState<{ found: boolean; cita?: typeof citas[0] } | null>(null);

  const requirements = [
    'Tarjeta de circulación vigente (original y copia)',
    'Constancia de la verificación anterior (holograma)',
    'Factura o carta factura (solo para autos nuevos o cambios de propietario)',
    'Identificación oficial (INE, pasaporte, licencia)',
    'Estar al corriente: No tener multas de tránsito, adeudos de tenencia o refrendo',
  ];

  const verificationStatus = [
    { label: 'Verificación Aprobada', variant: 'success' as const, icon: CheckCircle },
    { label: 'Pendiente', variant: 'warning' as const, icon: Hourglass },
    { label: 'Rechazada', variant: 'error' as const, icon: XCircle },
    { label: 'En Proceso', variant: 'info' as const, icon: AlertTriangle },
    { label: 'Sin Verificar', variant: 'default' as const, icon: Clock },
  ];

  const handleComplete = () => {
    navigate('/booking');
  };

  const handleSearch = () => {
    const normalizedPlate = searchPlate.toUpperCase().trim();
    const normalizedFolio = searchFolio.toUpperCase().trim();
    
    if (!normalizedPlate || !normalizedFolio) return;

    const found = citas.find(c => 
      c.vehicle.toUpperCase().includes(normalizedPlate) && 
      c.folio.toUpperCase().includes(normalizedFolio)
    );
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
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-black text-primary mb-4">
                  ¿Qué necesitas para verificar?
                </h2>
                <p className="text-lg text-secondary">
                  Prepárate con estos documentos antes de tu cita
                </p>
              </div>
              <RequirementsChecklist 
                requirements={requirements}
                onComplete={handleComplete}
              />
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
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Número de Placa</label>
                        <input 
                          type="text" 
                          placeholder="ABC-1234" 
                          value={searchPlate}
                          onChange={(e) => setSearchPlate(e.target.value)}
                          className="w-full px-5 py-4 border-2 border-border rounded-2xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none text-lg font-medium bg-white dark:bg-zinc-900 transition-all"
                        />
                      </div>
                      <div className="relative">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Folio de Cita</label>
                        <input 
                          type="text" 
                          placeholder="V-XXXX" 
                          value={searchFolio}
                          onChange={(e) => setSearchFolio(e.target.value)}
                          className="w-full px-5 py-4 border-2 border-border rounded-2xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none text-lg font-medium bg-white dark:bg-zinc-900 transition-all font-mono"
                        />
                      </div>
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
                             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Folio</p>
                             <p className="font-black text-red-600 dark:text-red-500 text-lg">{searchResult.cita.folio}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Placa</p>
                             <p className="font-bold text-slate-900 dark:text-white text-lg uppercase">{searchResult.cita.vehicle}</p>
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

                        <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-2xl p-4 flex items-center gap-3 mb-8">
                          <MapPin className="w-5 h-5 text-red-600 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Centro de Verificación</p>
                            <p className="font-bold text-slate-700 dark:text-zinc-200 truncate">{searchResult.cita.center} – {searchResult.cita.address}</p>
                          </div>
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

        <section id="verificentros" className="scroll-mt-28 py-20 bg-gradient-to-b from-slate-50 to-white dark:from-zinc-900 dark:to-zinc-800">
          <div className="container mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-5xl mx-auto"
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-black text-primary mb-4">
                  Verificentros Cercanos
                </h2>
                <p className="text-lg text-secondary">
                  Encuentra el centro de verificación más cercano a ti
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {verificationCenters.slice(0, 3).map((center, index) => (
                  <motion.div
                    key={center.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="group bg-white dark:bg-zinc-900 dark:bg-slate-800 rounded-2xl p-6 border-2 border-slate-100 dark:border-zinc-800 hover:border-red-300 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-primary mb-2">{center.name}</h3>
                    <p className="text-secondary mb-3">{center.address}</p>
                    {center.phone && (
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Phone className="w-4 h-4" />
                        <span>{center.phone}</span>
                      </div>
                    )}
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                      <span className="text-sm font-medium text-red-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                        Ver ubicación <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center mt-10">
                <Button variant="outline" size="lg" onClick={() => navigate('/booking')} className="border-2 border-slate-300 hover:border-red-500">
                  Ver todos los verificentros
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-zinc-900">
          <div className="container mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-black text-primary mb-4">
                  Estados de tu Verificación
                </h2>
                <p className="text-lg text-secondary">
                  Conoce el significado de cada estado
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                {verificationStatus.map((status, index) => {
                  const Icon = status.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="flex items-center gap-3 bg-gradient-to-br from-slate-50 to-white dark:from-zinc-800 dark:to-zinc-900 px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-zinc-800 hover:shadow-lg transition-shadow"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        status.variant === 'success' ? 'bg-green-100' :
                        status.variant === 'warning' ? 'bg-amber-100' :
                        status.variant === 'error' ? 'bg-red-100' :
                        status.variant === 'info' ? 'bg-blue-100' :
                        'bg-slate-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          status.variant === 'success' ? 'text-green-600' :
                          status.variant === 'warning' ? 'text-amber-600' :
                          status.variant === 'error' ? 'text-red-600' :
                          status.variant === 'info' ? 'text-blue-600' :
                          'text-secondary'
                        }`} />
                      </div>
                      <Badge variant={status.variant} className="font-semibold">
                        {status.label}
                      </Badge>
                    </motion.div>
                  );
                })}
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
