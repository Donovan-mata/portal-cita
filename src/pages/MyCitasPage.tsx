import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Car, ChevronLeft, AlertCircle, CheckCircle, XCircle, Hourglass, Trash2, RefreshCw, CalendarPlus, Bell } from 'lucide-react';
import { useMyCitasStore, Cita } from '@/store/myCitasStore';
import Header from '@/components/Header';
import { Badge, Button } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';

const statusConfig: Record<Cita['status'], { variant: 'success' | 'warning' | 'error' | 'info' | 'default'; label: string; icon: React.ElementType }> = {
  confirmada: { variant: 'success', label: 'Confirmada', icon: CheckCircle },
  pendiente:  { variant: 'warning', label: 'Pendiente',  icon: Hourglass },
  completada: { variant: 'info',    label: 'Completada', icon: CheckCircle },
  cancelada:  { variant: 'error',   label: 'Cancelada',  icon: XCircle },
};

// ── helpers ─────────────────────────────────────────────────────────────────

function parseCitaDate(dateStr: string, timeStr: string): Date | null {
  try {
    const months: Record<string, number> = {
      enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
      julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11,
    };
    const dp = dateStr.toLowerCase().match(/(\d+)\s+de\s+(\w+)\s+de\s+(\d{4})/);
    if (!dp) return null;
    const day = parseInt(dp[1]);
    const month = months[dp[2]];
    const year = parseInt(dp[3]);

    const tp = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!tp) return null;
    let hours = parseInt(tp[1]);
    const minutes = parseInt(tp[2]);
    const period = tp[3].toUpperCase();
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return new Date(year, month, day, hours, minutes, 0);
  } catch {
    return null;
  }
}

function buildGoogleCalendarUrl(cita: Cita): string {
  const target = parseCitaDate(cita.date, cita.time);
  if (!target) return 'https://calendar.google.com';

  const pad = (n: number) => String(n).padStart(2, '0');
  const fmt = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

  const end = new Date(target.getTime() + 60 * 60 * 1000);
  const title    = encodeURIComponent(`Verificación Vehicular – ${cita.vehicle}`);
  const location = encodeURIComponent(`${cita.center}, ${cita.address}`);
  const details  = encodeURIComponent(
    `Cita de verificación vehicular.\nVehículo: ${cita.vehicle} (${cita.vehicleType})\nCentro: ${cita.center}\nDirección: ${cita.address}`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(target)}/${fmt(end)}&details=${details}&location=${location}`;
}

// ── countdown hook ───────────────────────────────────────────────────────────

function useCountdown(target: Date | null) {
  const calc = () => {
    if (!target) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, isUrgent: false };
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, isUrgent: false };
    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return { days, hours, minutes, seconds, isPast: false, isUrgent: days === 0 };
  };

  const [state, setState] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setState(calc()), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.getTime()]);

  return state;
}

// ── countdown widget ─────────────────────────────────────────────────────────

const CountdownWidget: React.FC<{ cita: Cita }> = ({ cita }) => {
  const target = parseCitaDate(cita.date, cita.time);
  const { days, hours, minutes, seconds, isPast, isUrgent } = useCountdown(target);

  if (cita.status !== 'confirmada' && cita.status !== 'pendiente') return null;
  if (isPast) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-4 rounded-2xl p-4 border ${
          isUrgent
            ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/40'
            : 'bg-gradient-to-r from-slate-50 to-orange-50 dark:from-zinc-800/60 dark:to-zinc-800/40 border-slate-200 dark:border-zinc-700/40'
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          {isUrgent ? (
            <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
              <Bell className="w-4 h-4 text-red-600" />
            </motion.div>
          ) : (
            <Clock className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
          )}
          <span className={`text-xs font-bold uppercase tracking-widest ${isUrgent ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-zinc-400'}`}>
            {isUrgent ? '¡Tu cita es HOY!' : 'Tiempo restante'}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { val: days,    label: 'días' },
            { val: hours,   label: 'horas' },
            { val: minutes, label: 'min' },
            { val: seconds, label: 'seg' },
          ].map(({ val, label }) => (
            <div
              key={label}
              className={`rounded-xl py-2.5 text-center ${
                isUrgent
                  ? 'bg-red-100 dark:bg-red-900/30'
                  : 'bg-white dark:bg-zinc-900 shadow-sm border border-slate-100 dark:border-zinc-700'
              }`}
            >
              <motion.div
                key={val}
                initial={{ y: -6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`text-2xl font-black tabular-nums ${isUrgent ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}
              >
                {String(val).padStart(2, '0')}
              </motion.div>
              <div className={`text-[10px] font-bold uppercase tracking-wider ${isUrgent ? 'text-red-500/70' : 'text-slate-400 dark:text-zinc-500'}`}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── page ─────────────────────────────────────────────────────────────────────

const MyCitasPage: React.FC = () => {
  const navigate = useNavigate();
  const { citas, removeCita } = useMyCitasStore();

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

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Mis Citas</h1>
              <p className="text-lg text-slate-600">Gestiona tus citas de verificación vehicular</p>
            </motion.div>

            {citas.length > 0 ? (
              <div className="space-y-6">
                {citas.map((cita, index) => {
                  const StatusIcon = statusConfig[cita.status].icon;
                  return (
                    <motion.div
                      key={cita.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-slate-100 dark:border-zinc-800 overflow-hidden"
                    >
                      {/* Header banner */}
                      <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-orange-500 px-6 py-5 flex items-center justify-between overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />

                        <div className="flex items-center gap-4 relative z-10">
                          <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-inner">
                            <Calendar className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-widest text-white/70 font-bold mb-0.5">Folio CDMX-2026</div>
                            <span className="text-white font-black text-xl tracking-tight">{cita.folio}</span>
                          </div>
                        </div>

                        <Badge variant={statusConfig[cita.status].variant} className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-xl shadow-sm">
                          <StatusIcon className="w-4 h-4 mr-1.5" />
                          <span className="font-bold tracking-wide leading-none">{statusConfig[cita.status].label}</span>
                        </Badge>
                      </div>

                      {/* Body */}
                      <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Vehículo */}
                          <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-2xl p-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm">
                                <Car className="w-5 h-5 text-slate-600" />
                              </div>
                              <div>
                                <div className="text-xs text-slate-500 font-medium">Vehículo</div>
                                <div className="font-bold text-slate-900 dark:text-white text-lg">{cita.vehicle}</div>
                                <div className="text-sm text-slate-600 capitalize">{cita.vehicleType}</div>
                              </div>
                            </div>
                          </div>

                          {/* Verificentro */}
                          <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-2xl p-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm">
                                <MapPin className="w-5 h-5 text-slate-600" />
                              </div>
                              <div>
                                <div className="text-xs text-slate-500 font-medium">Verificentro</div>
                                <div className="font-bold text-slate-900 dark:text-white">{cita.center}</div>
                                <div className="text-sm text-slate-600">{cita.address}</div>
                              </div>
                            </div>
                          </div>

                          {/* Fecha + hora + countdown */}
                          <div className="md:col-span-2 bg-gradient-to-r from-red-50 to-orange-50 dark:from-zinc-800/80 dark:to-zinc-800/50 rounded-2xl p-5 border border-red-100/50 dark:border-zinc-700/30">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm">
                                <Clock className="w-6 h-6 text-red-600" />
                              </div>
                              <div>
                                <div className="text-xs text-slate-500 dark:text-zinc-500 font-medium">Fecha y Hora</div>
                                <div className="font-bold text-slate-900 dark:text-zinc-100 text-lg">{cita.date}</div>
                                <div className="text-red-600 dark:text-red-500 font-semibold">{cita.time}</div>
                              </div>
                            </div>
                            <CountdownWidget cita={cita} />
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-zinc-800 flex gap-3 flex-wrap">
                          {(cita.status === 'confirmada' || cita.status === 'pendiente') && (
                            <a
                              href={buildGoogleCalendarUrl(cita)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border-2 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-bold text-sm bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:border-blue-400 transition-all"
                            >
                              <CalendarPlus className="w-4 h-4" />
                              Añadir a Calendario
                            </a>
                          )}
                          {cita.status === 'confirmada' && (
                            <Button onClick={() => navigate('/booking')} className="flex-1 sm:flex-none">
                              <RefreshCw className="w-4 h-4" />
                              Reprogramar
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            onClick={() => removeCita(cita.id)}
                            className="flex-1 sm:flex-none hover:text-red-600 dark:hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                            Cancelar Cita
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-zinc-800 shadow-lg"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No tienes citas</h3>
                <p className="text-slate-600 mb-8">Agenda tu verificación vehicular</p>
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Agendar Cita
                </Link>
              </motion.div>
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
    </div>
  );
};

export default MyCitasPage;
