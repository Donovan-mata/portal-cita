import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Car, ChevronLeft, AlertCircle, AlertTriangle, CheckCircle, XCircle, Hourglass, Trash2, RefreshCw, CalendarPlus, Bell } from 'lucide-react';
import { useMyCitasStore, Cita } from '@/store/myCitasStore';
import { useAppointmentStore } from '@/store/appointmentStore';
import Header from '@/components/Header';
import { Badge, Button, ConfirmationDialog, HologramTag } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { statusConfig, verificationStatusConfig } from '@/lib/configs';
import { CitaCard } from '@/components/citas/CitaCard';



// ── page ─────────────────────────────────────────────────────────────────────

const MyCitasPage: React.FC = () => {
  const navigate = useNavigate();
  const { citas, removeCita, fetchCitas, isLoading } = useMyCitasStore();
  const { setVehiclesInfo } = useAppointmentStore();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCitaId, setSelectedCitaId] = useState<string | null>(null);

  useEffect(() => {
    fetchCitas();
  }, [fetchCitas]);

  const handleReschedule = (cita: Cita) => {
    // Fill the store with the data from the appointment
    setVehiclesInfo([{
      plate: cita.vehicle,
      type: cita.vehicleType,
      model: cita.vehicleModel || '2024'
    }]);
    
    // De-facto, to reprogram means we'll replace the old one or just start a new flow
    // For now, I'll navigate to booking. In BookingPage we'll handle the step jump.
    navigate('/booking?reschedule=true&id=' + cita.id);
  };

  const handleCancelClick = (id: string) => {
    setSelectedCitaId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmCancel = () => {
    if (selectedCitaId) {
      removeCita(selectedCitaId);
      setSelectedCitaId(null);
    }
  };

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcomingCitas = citas.filter(c => c.status === 'confirmada' || c.status === 'pendiente');
  const pastCitas = citas.filter(c => c.status === 'completada' || c.status === 'cancelada');

  const displayCitas = activeTab === 'upcoming' ? upcomingCitas : pastCitas;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-900">
      <Header />

      <main className="flex-grow pt-28 pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
              <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-red-600 font-medium transition-colors">
                <ChevronLeft className="w-5 h-5" />
                Volver al inicio
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Mis Citas</h1>
              <p className="text-lg text-slate-500 dark:text-zinc-400">Gestiona y consulta el estado de tus trámites vehiculares.</p>
            </motion.div>

            {/* Dashboard Summary */}
            {citas.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
              >
                <div className="bg-white dark:bg-zinc-800 p-5 rounded-[24px] border border-slate-100 dark:border-zinc-800 shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Total</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{citas.length}</span>
                </div>
                <div className="bg-white dark:bg-zinc-800 p-5 rounded-[24px] border border-slate-100 dark:border-zinc-800 shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 block mb-1">Próximas</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{upcomingCitas.length}</span>
                </div>
                <div className="bg-white dark:bg-zinc-800 p-5 rounded-[24px] border border-slate-100 dark:border-zinc-800 shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-500 block mb-1">Completadas</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{citas.filter(c => c.status === 'completada').length}</span>
                </div>
                <div className="bg-white dark:bg-zinc-800 p-5 rounded-[24px] border border-slate-100 dark:border-zinc-800 shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-500 block mb-1">Canceladas</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{citas.filter(c => c.status === 'cancelada').length}</span>
                </div>
              </motion.div>
            )}

            {/* Tabs Navigation */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-800 rounded-2xl p-1.5 mb-8">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === 'upcoming'
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-zinc-500 hover:text-slate-800 dark:hover:text-zinc-300'
                }`}
              >
                Próximas
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === 'upcoming' ? 'bg-[#d41111] text-white' : 'bg-slate-200 dark:bg-zinc-600 text-slate-500 dark:text-zinc-400'
                }`}>
                  {upcomingCitas.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === 'past'
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-zinc-500 hover:text-slate-800 dark:hover:text-zinc-300'
                }`}
              >
                Pasadas / Canceladas
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === 'past' ? 'bg-[#d41111] text-white' : 'bg-slate-200 dark:bg-zinc-600 text-slate-500 dark:text-zinc-400'
                }`}>
                  {pastCitas.length}
                </span>
              </button>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-20 gap-4">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-[#d41111] rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Sincronizando con la nube...</p>
              </div>
            ) : (
            <AnimatePresence mode="wait">
              {displayCitas.length > 0 ? (
                <motion.div 
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {displayCitas.map((cita, index) => (
                    <CitaCard 
                      key={cita.id}
                      cita={cita}
                      index={index}
                      isUpcoming={activeTab === 'upcoming'}
                      onReschedule={handleReschedule}
                      onCancel={handleCancelClick}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-zinc-900 rounded-[32px] p-16 text-center border border-slate-100 dark:border-zinc-800/60 shadow-lg"
                >
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 bg-slate-100 dark:bg-zinc-800 rounded-full animate-ping opacity-20"></div>
                    <div className="relative w-24 h-24 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center border border-slate-100 dark:border-zinc-700">
                      <Calendar className="w-12 h-12 text-slate-300" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No tienes citas {activeTab === 'upcoming' ? 'próximas' : 'pasadas'}</h3>
                  <p className="text-slate-500 dark:text-zinc-500 mb-8 max-w-xs mx-auto">
                    {activeTab === 'upcoming' 
                      ? 'Agenda tu verificación para asegurar tu lugar en el centro más cercano.' 
                      : 'Aquí aparecerá el historial de tus verificaciones anteriores.'}
                  </p>
                  {activeTab === 'upcoming' && (
                    <Link
                      to="/booking"
                      className="inline-flex items-center gap-2 px-10 py-4 bg-[#d41111] text-white font-black rounded-2xl hover:bg-[#b00e0e] transition-all shadow-xl shadow-red-500/20 active:scale-95"
                    >
                      Agendar mi Primera Cita
                    </Link>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            )}

            {/* Info banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-900/30 rounded-2xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-base font-bold text-blue-900 dark:text-blue-300 mb-1">Información importante</p>
                  <p className="text-sm text-blue-700 dark:text-blue-400/80">
                    Presenta tu INE y tarjeta de circulación el día de tu cita. Llega 15 minutos antes de tu horario.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </main>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmCancel}
        title="¿Cancelar cita?"
        description="Esta acción eliminará tu cita de verificación de forma permanente. No podrás deshacer este cambio."
        confirmText="Sí, cancelar cita"
        cancelText="No, mantener"
        variant="danger"
      />
    </div>
  );
};

export default MyCitasPage;
