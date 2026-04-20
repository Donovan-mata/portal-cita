import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Car, MapPin, Clock, CalendarPlus, RefreshCw, Trash2 } from 'lucide-react';
import { Cita } from '@/store/myCitasStore';
import { Badge, Button, HologramTag } from '@/components/ui';
import { statusConfig, verificationStatusConfig } from '@/lib/configs';
import { buildGoogleCalendarUrl } from '@/lib/dateUtils';
import { CountdownWidget } from './CountdownWidget';

interface CitaCardProps {
  cita: Cita;
  index: number;
  isUpcoming: boolean;
  onReschedule: (cita: Cita) => void;
  onCancel: (id: string) => void;
}

export const CitaCard: React.FC<CitaCardProps> = ({ 
  cita, 
  index, 
  isUpcoming, 
  onReschedule, 
  onCancel 
}) => {
  const StatusIcon = statusConfig[cita.status]?.icon || Clock;
  const verifConfig = verificationStatusConfig[cita.verificationStatus || 'sin_verificar'] || verificationStatusConfig['sin_verificar'];
  const VerifIcon = verifConfig.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-zinc-900 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 dark:border-zinc-800/60 overflow-hidden"
    >
      {/* Header banner */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800">
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-12 h-12 bg-[#d41111] rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)]"></div>
              <Calendar className="w-6 h-6 text-white relative z-10" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-zinc-400">Placa Vehicular</span>
              <div className="h-px w-8 bg-slate-200 dark:bg-zinc-700"></div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-900 dark:text-white font-black text-2xl tracking-tighter drop-shadow-sm uppercase">{cita.vehicle}</span>
              <div className="h-5 w-px bg-slate-200 dark:bg-zinc-700"></div>
              <span className="text-[10px] font-bold text-slate-600 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-zinc-700 w-auto inline-flex capitalize">{cita.vehicleType}</span>
              {cita.hologram && (
                <>
                  <div className="h-5 w-px bg-slate-200 dark:bg-zinc-700"></div>
                  <HologramTag hologram={cita.hologram} />
                </>
              )}
            </div>
          </div>
        </div>

        <Badge variant={statusConfig[cita.status].variant} className="px-3 py-1.5 rounded-full font-black text-[10px] uppercase tracking-wider">
          <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
          {statusConfig[cita.status].label}
        </Badge>
      </div>

      {/* Body */}
      <div className="p-8">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            {/* Folio */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-950/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Car className="w-6 h-6 text-[#d41111]" />
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Folio Oficial</div>
                <div className="font-black text-red-600 dark:text-red-500 text-2xl tracking-tight leading-none mb-1 uppercase font-mono">{cita.folio}</div>
                <div className="text-sm font-bold text-slate-500 dark:text-zinc-400">Unidad CDMX</div>
              </div>
            </div>

            {/* Verificentro */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Verificentro</div>
                <div className="font-black text-slate-900 dark:text-white text-lg leading-tight uppercase">{cita.center}</div>
                <div className="text-sm font-medium text-slate-500 dark:text-zinc-400">{cita.address}</div>
              </div>
            </div>
            
            {/* Estado de Verificación */}
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${
                verifConfig.variant === 'success' ? 'bg-green-50 dark:bg-green-950/20 text-green-600 border-green-200 dark:border-green-900/40' :
                verifConfig.variant === 'error' ? 'bg-red-50 dark:bg-red-950/20 text-red-600 border-red-200 dark:border-red-900/40' :
                verifConfig.variant === 'warning' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-200 dark:border-amber-900/40' :
                verifConfig.variant === 'info' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 border-blue-200 dark:border-blue-900/40' :
                'bg-slate-50 dark:bg-slate-900/20 text-slate-600 border-slate-200 dark:border-zinc-700/50'
              }`}>
                <VerifIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Estado de Verificación</div>
                <div className={`font-black text-lg leading-tight uppercase ${
                  verifConfig.variant === 'success' ? 'text-green-600 dark:text-green-500' :
                  verifConfig.variant === 'error' ? 'text-red-600 dark:text-red-500' :
                  verifConfig.variant === 'warning' ? 'text-amber-600 dark:text-amber-500' :
                  verifConfig.variant === 'info' ? 'text-blue-600 dark:text-blue-500' :
                  'text-slate-600 dark:text-slate-400'
                }`}>{verifConfig.label}</div>
                <div className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                  {cita.verificationStatus === 'sin_verificar' ? 'Pendiente de presentar' : 'Resultado oficial validado'}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Fecha y Hora */}
            <div className="bg-slate-50 dark:bg-zinc-800/40 rounded-3xl p-6 border border-slate-100 dark:border-zinc-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white dark:bg-zinc-900 shadow-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Cita Programada</div>
                  <div className="font-black text-slate-900 dark:text-white text-xl leading-none">{cita.date}</div>
                </div>
              </div>
              <div className="inline-flex px-4 py-2 bg-[#d41111] text-white rounded-xl font-black text-lg shadow-lg shadow-red-500/20 mb-4">
                {cita.time}
              </div>
              
              {isUpcoming && <CountdownWidget cita={cita} />}
            </div>
          </div>
        </div>

        {/* Action footer */}
        <div className="pt-8 border-t border-slate-100 dark:border-zinc-800 flex flex-col lg:flex-row gap-4">
          {isUpcoming && (
            <>
              <a
                href={buildGoogleCalendarUrl(cita)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 rounded-[22px] border-2 border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 font-extrabold text-sm bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-all active:scale-[0.98]"
              >
                <CalendarPlus className="w-5 h-5" />
                Google Calendar
              </a>
              {cita.status === 'confirmada' && (
                <Button 
                  onClick={() => onReschedule(cita)} 
                  className="flex-[1.5] h-14 rounded-[22px] bg-[#d41111] hover:bg-[#b00e0e] text-white font-black shadow-lg shadow-red-500/20"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Reprogramar Cita
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => onCancel(cita.id)}
                className="flex-1 h-14 rounded-[22px] text-[#d41111] dark:text-red-400 border-red-100 dark:border-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </>
          )}
          {!isUpcoming && (
            <div className="w-full text-center py-2 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl">
              <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.3em]">Registro Histórico Protegido</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
