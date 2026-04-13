import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Car, Clock, Check, ChevronRight, CarFront, Truck, Plus, Trash2 } from 'lucide-react';
import { useAppointmentStore } from '@/store/appointmentStore';
import { useMyCitasStore, generateFolio } from '@/store/myCitasStore';
import { Copy, CheckCircle2 } from 'lucide-react';

import Header from '@/components/Header';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';

const singleVehicleSchema = z.object({
  plate: z.string()
    .min(7, 'Verifica el formato, ej: ABC-123')
    .max(8, 'No puede exceder 8 caracteres')
    .regex(/^[A-Z0-9]{3}-[A-Z0-9]{3,4}$/, 'Formato inválido. E.g. ABC-1234'),
  vehicleType: z.enum(['particular', 'taxi', 'carga']),
  model: z.string().min(4, 'Ingresa el año del vehículo').max(4),
});

const formSchema = z.object({
  vehicles: z.array(singleVehicleSchema).min(1, 'Agrega al menos un vehículo')
});

type FormValues = z.infer<typeof formSchema>;

const vehicleTypes = [
  { value: 'particular', label: 'Particular', icon: CarFront },
  { value: 'taxi', label: 'Taxi', icon: Car },
  { value: 'carga', label: 'Carga', icon: Truck },
];

// Single lightweight fade variant used everywhere
const fadeUp: any = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit:   { opacity: 0, y: -8,  transition: { duration: 0.2, ease: 'easeIn' } },
};

function BookingPage() {
  const { selectedDate, selectedTime, setSelectedDate, setSelectedTime, setVehiclesInfo, vehiclesInfo, reset } = useAppointmentStore();
  const { addCita } = useMyCitasStore();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmedData, setConfirmedData] = useState<{
    vehicles: { plate: string; type: string; model: string; folio: string }[]; date: string; time: string;
  } | null>(null);
  const [step, setStep] = useState<1 | 2>(1); // 1 = datos, 2 = fecha+hora
  const [isFleetMode, setIsFleetMode] = useState(false);
  const [copiedFolio, setCopiedFolio] = useState<string | null>(null);

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicles: vehiclesInfo && vehiclesInfo.length > 0
        ? vehiclesInfo.map(v => ({ plate: v.plate, vehicleType: v.type as 'particular'|'taxi'|'carga', model: v.model }))
        : [{ plate: '', vehicleType: 'particular', model: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'vehicles' });
  const watchedVehicles = watch('vehicles');

  const onSubmit = (data: FormValues) => {
    setVehiclesInfo(data.vehicles.map(v => ({ plate: v.plate, type: v.vehicleType, model: v.model })));
    setStep(2);
  };

  const handleConfirmAppointment = () => {
    if (!selectedDate || !selectedTime || !vehiclesInfo) return;
    const dateLabel = new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
    
    const newConfirmedVehicles: { plate: string; type: string; model: string; folio: string }[] = [];

    vehiclesInfo.forEach(v => {
      const folio = generateFolio();
      addCita({
        vehicle: v.plate,
        vehicleType: v.type,
        folio: folio,
        center: 'Verificentro Vallejo AZ20',
        address: 'Industrial Vallejo, Azcapotzalco',
        date: dateLabel,
        time: selectedTime,
        status: 'confirmada',
      });
      newConfirmedVehicles.push({ ...v, folio });
    });

    setConfirmedData({ vehicles: newConfirmedVehicles, date: dateLabel, time: selectedTime });
    setIsSubmitted(true);
    reset();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFolio(text);
    setTimeout(() => setCopiedFolio(null), 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-white dark:from-zinc-900 dark:to-zinc-900">
        <Header />
        <main className="flex-grow pt-32 pb-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="max-w-lg mx-auto text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 }}
                className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 mt-4 shadow-xl shadow-green-500/30"
              >
                <Check className="w-12 h-12 text-white" />
              </motion.div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">¡Cita Confirmada!</h1>
              <p className="text-lg text-slate-600 dark:text-zinc-400 mb-8">
                Tu cita de verificación ha sido agendada correctamente. Recibirás un correo de confirmación.
              </p>
                <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 shadow-sm dark:shadow-none border border-slate-200 dark:border-zinc-700 mb-8 overflow-hidden">
                  <div className="space-y-4">
                    <div className="flex flex-col py-3 border-b border-slate-200 dark:border-zinc-700/50">
                      <span className="text-slate-500 dark:text-zinc-400 flex items-center justify-between mb-3">
                        <span className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider"><Car className="w-4 h-4" /> Resumen de Unidades</span>
                        <span className="text-[10px] font-black bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded-full">{confirmedData?.vehicles?.length || 0} VEHÍCULO(S)</span>
                      </span>
                      <div className="space-y-3">
                        {confirmedData?.vehicles?.map((v, i) => (
                          <div key={i} className="group flex flex-col bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 hover:border-red-200 dark:hover:border-red-900/30 transition-all">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="font-black text-slate-900 dark:text-white text-lg tracking-tight uppercase">{v.plate}</span>
                                <span className="text-xs text-slate-500 dark:text-zinc-500 block capitalize">{v.type} · {v.model}</span>
                              </div>
                              <button 
                                onClick={() => copyToClipboard(v.folio)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-[10px] font-bold text-slate-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-500 hover:border-red-200 transition-all shadow-sm active:scale-95"
                              >
                                {copiedFolio === v.folio ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                {copiedFolio === v.folio ? 'COPIADO' : v.folio}
                              </button>
                            </div>
                            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50 dark:border-zinc-800/50">
                              <span className="text-[10px] text-slate-400 font-bold uppercase">Folio oficial:</span>
                              <span className="text-sm font-black text-red-600 dark:text-red-500">{v.folio}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-1">Fecha</span>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{confirmedData?.date}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-1">Horario</span>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{confirmedData?.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/" className="flex-1 py-4 px-6 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors text-center shadow-md hover:shadow-lg transition-all">
                  Volver al inicio
                </Link>
                <Link to="/mis-citas" className="flex-1 py-4 px-6 bg-[#d41111] hover:bg-gradient-to-r hover:from-[#d41111] hover:to-[#f97316] text-white font-bold rounded-xl transition-all shadow-sm dark:hover:shadow-[0_0_15px_rgba(212,17,17,0.4)] text-center">
                  Ver mis citas
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-900">
      <Header />

      <main className="flex-grow pt-28 pb-12">
        <div className="container mx-auto px-6">

          {/* ── Header + Step Indicator ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-5">
              Agenda tu Cita
            </h1>

            {/* Step pills */}
            <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-zinc-800 rounded-full p-1.5">
              <button
                onClick={() => setStep(1)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  step === 1
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
                  step > 1 ? 'bg-green-500 text-white' : 'bg-[#d41111] text-white'
                }`}>
                  {step > 1 ? <Check className="w-3 h-3" /> : '1'}
                </span>
                Vehículo
              </button>
              <button
                onClick={() => vehiclesInfo && setStep(2)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  step === 2
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700'
                } ${!vehiclesInfo ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
                  step === 2 ? 'bg-[#d41111] text-white' : 'bg-slate-300 dark:bg-zinc-600 text-slate-600 dark:text-zinc-400'
                }`}>2</span>
                Fecha y Hora
              </button>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* ── Main content (animated step swap) ── */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-white dark:bg-zinc-800 rounded-3xl p-8 shadow-sm dark:shadow-none border border-slate-200 dark:border-zinc-700"
                  >
                    <div className="mb-8 border-b border-slate-100 dark:border-zinc-700/50 pb-6">
                      <div className="flex items-center gap-4 mb-1">
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl blur-sm opacity-20 animate-pulse"></div>
                          <div className="relative w-full h-full bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden border border-white/20">
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]"></div>
                            <Car className="w-6 h-6 text-white relative z-10" />
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.2em] text-[#d41111] font-black mb-0.5">Paso 1 de 2</div>
                          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Datos del Vehículo</h2>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 ml-16">Completa la información oficial de tu unidad para continuar.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="flex justify-between items-center bg-slate-50 dark:bg-zinc-800 p-2 rounded-xl mb-4 border border-slate-200 dark:border-zinc-700">
                        <button type="button" onClick={() => { setIsFleetMode(false); if(fields.length > 1) { const first = watch('vehicles')[0]; remove(); append(first); } }} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${!isFleetMode ? 'bg-white dark:bg-zinc-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-zinc-400'}`}>Individual</button>
                        <button type="button" onClick={() => setIsFleetMode(true)} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${isFleetMode ? 'bg-white dark:bg-zinc-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-zinc-400'}`}>Flotilla</button>
                      </div>

                      {fields.map((field, index) => (
                        <motion.div key={field.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-5 border border-slate-200 dark:border-zinc-700 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 space-y-4 relative">
                          {isFleetMode && fields.length > 1 && (
                            <button type="button" onClick={() => remove(index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5"/></button>
                          )}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">Placa Vehículo {fields.length > 1 ? index + 1 : ''}</label>
                            <input
                              {...register(`vehicles.${index}.plate`)}
                              onChange={(e) => {
                                let val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                                if (val.length > 3) val = `${val.slice(0, 3)}-${val.slice(3, 7)}`;
                                e.target.value = val;
                                register(`vehicles.${index}.plate`).onChange(e);
                              }}
                              maxLength={8}
                              className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:border-[#d41111] dark:focus:border-[#d41111] focus:ring-1 focus:ring-[#d41111] outline-none text-lg font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 uppercase"
                              placeholder="ABC-1234"
                            />
                            {errors.vehicles?.[index]?.plate && <p className="text-red-500 text-sm mt-2 font-medium">{errors.vehicles[index]?.plate?.message}</p>}
                          </div>
                          
                          {/* Tipo */}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">Tipo de Vehículo</label>
                            <div className="grid grid-cols-3 gap-3">
                              {vehicleTypes.map((type) => {
                                const Icon = type.icon;
                                const isSelected = watchedVehicles?.[index]?.vehicleType === type.value;
                                return (
                                  <label key={type.value} className="cursor-pointer block relative">
                                    <input type="radio" {...register(`vehicles.${index}.vehicleType`)} value={type.value} className="sr-only" />
                                    <div className={`p-3 rounded-xl border-2 transition-all duration-300 text-center select-none ${isSelected ? 'border-[#d41111] bg-red-50 dark:bg-red-950/20 text-[#d41111] shadow-[0_0_15px_rgba(212,17,17,0.3)]' : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:border-slate-300 hover:shadow-lg'}`}>
                                      <Icon className={`w-6 h-6 mx-auto mb-2 transition-colors duration-300 ${isSelected ? 'text-[#d41111]' : 'text-slate-400 dark:text-zinc-500'}`} />
                                      <span className="text-xs font-semibold">{type.label}</span>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                            {errors.vehicles?.[index]?.vehicleType && <p className="text-red-500 text-sm mt-2 font-medium">{errors.vehicles[index]?.vehicleType?.message}</p>}
                          </div>

                          {/* Año */}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">Año del Modelo</label>
                            <input
                              type="number"
                              min="1990"
                              max={new Date().getFullYear() + 1}
                              {...register(`vehicles.${index}.model`)}
                              className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:border-[#d41111] dark:focus:border-[#d41111] focus:ring-1 focus:ring-[#d41111] outline-none text-lg font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                              placeholder="2024"
                            />
                            {errors.vehicles?.[index]?.model && <p className="text-red-500 text-sm mt-2 font-medium">{errors.vehicles[index]?.model?.message}</p>}
                          </div>
                        </motion.div>
                      ))}

                      {isFleetMode && fields.length < 10 && (
                        <button type="button" onClick={() => append({ plate: '', vehicleType: 'particular', model: '' })} className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-xl text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white hover:border-slate-400 dark:hover:border-zinc-500 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all font-semibold flex items-center justify-center gap-2">
                          <Plus className="w-5 h-5" /> Añadir otro vehículo
                        </button>
                      )}

                      <Button type="submit" size="lg" className="w-full pt-4">
                        Continuar <ChevronRight className="w-5 h-5" />
                      </Button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-white dark:bg-zinc-800 rounded-3xl p-8 shadow-sm dark:shadow-none border border-slate-200 dark:border-zinc-700"
                  >
                    <div className="mb-8 border-b border-slate-100 dark:border-zinc-700/50 pb-6">
                      <div className="flex items-center gap-4 mb-1">
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl blur-sm opacity-20 animate-pulse"></div>
                          <div className="relative w-full h-full bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden border border-white/20">
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]"></div>
                            <Calendar className="w-6 h-6 text-white relative z-10" />
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.2em] text-[#d41111] font-black mb-0.5">Paso 2 de 2</div>
                          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Fecha y Hora</h2>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 ml-16">Selecciona el horario disponible para tu centro de verificación.</p>
                    </div>

                    {(() => {
                      const todayMX = new Intl.DateTimeFormat('en-CA', {
                        timeZone: 'America/Mexico_City',
                        year: 'numeric', month: '2-digit', day: '2-digit',
                      }).format(new Date()); // gives YYYY-MM-DD
                      const maxYear = new Date().getFullYear() + 1;
                      return (
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300">Fecha</label>
                            <span className="text-xs text-slate-400 dark:text-zinc-500">Hoy: {new Intl.DateTimeFormat('es-MX', { timeZone: 'America/Mexico_City', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}</span>
                          </div>
                          <input
                            type="date"
                            min={todayMX}
                            max={`${maxYear}-12-31`}
                            value={selectedDate ?? todayMX}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:border-[#d41111] outline-none transition-colors text-lg text-slate-900 dark:text-zinc-200 cursor-pointer"
                          />
                        </div>
                      );
                    })()}

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-4">Horario disponible</label>

                      {/* Mañana */}
                      <div className="mb-4">
                        <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-2">☀️ Mañana</p>
                        <div className="grid grid-cols-4 gap-2">
                          {['8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM'].map((time) => (
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              key={time} type="button" onClick={() => setSelectedTime(time)}
                              className={`py-2.5 px-1 rounded-xl text-xs font-bold transition-all duration-300 border ${selectedTime === time ? 'bg-[#d41111] text-white border-[#d41111] shadow-[0_0_12px_rgba(212,17,17,0.4)]' : 'bg-slate-50 dark:bg-zinc-900 text-slate-700 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:border-[#d41111] hover:text-[#d41111] hover:bg-white dark:hover:bg-zinc-800 hover:shadow-md'}`}>
                              {time}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Tarde */}
                      <div className="mb-4">
                        <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-2">🌤 Tarde</p>
                        <div className="grid grid-cols-4 gap-2">
                          {['12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM'].map((time) => (
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              key={time} type="button" onClick={() => setSelectedTime(time)}
                              className={`py-2.5 px-1 rounded-xl text-xs font-bold transition-all duration-300 border ${selectedTime === time ? 'bg-[#d41111] text-white border-[#d41111] shadow-[0_0_12px_rgba(212,17,17,0.4)]' : 'bg-slate-50 dark:bg-zinc-900 text-slate-700 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:border-[#d41111] hover:text-[#d41111] hover:bg-white dark:hover:bg-zinc-800 hover:shadow-md'}`}>
                              {time}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Tarde-Noche */}
                      <div>
                        <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-2">🌙 Tarde-Noche</p>
                        <div className="grid grid-cols-4 gap-2">
                          {['4:00 PM','4:30 PM','5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM'].map((time) => (
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              key={time} type="button" onClick={() => setSelectedTime(time)}
                              className={`py-2.5 px-1 rounded-xl text-xs font-bold transition-all duration-300 border ${selectedTime === time ? 'bg-[#d41111] text-white border-[#d41111] shadow-[0_0_12px_rgba(212,17,17,0.4)]' : 'bg-slate-50 dark:bg-zinc-900 text-slate-700 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:border-[#d41111] hover:text-[#d41111] hover:bg-white dark:hover:bg-zinc-800 hover:shadow-md'}`}>
                              {time}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Sidebar: Resumen ── */}
            <div>
              <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 shadow-sm dark:shadow-none border border-slate-200 dark:border-zinc-700 sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Resumen de Cita</h2>

                <div className="space-y-3">
                  {/* Vehículos */}
                  <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-zinc-900/80 border border-slate-100 dark:border-zinc-700/50 rounded-2xl">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1">
                      <Car className="w-4 h-4" /> {vehiclesInfo && vehiclesInfo.length > 1 ? `Flotilla (${vehiclesInfo.length})` : 'Vehículo'}
                    </div>
                    {vehiclesInfo ? vehiclesInfo.map((v, i) => (
                      <div key={i} className="flex justify-between items-center py-1.5 border-b border-slate-200 dark:border-zinc-800 last:border-0 last:pb-0">
                        <span className="font-bold text-sm text-slate-900 dark:text-white uppercase">{v.plate}</span>
                        <span className="text-xs text-slate-500 capitalize">{v.type}</span>
                      </div>
                    )) : (
                      <div className="text-sm font-bold text-slate-900 dark:text-white">Pendiente</div>
                    )}
                  </div>

                  {/* Fecha */}
                  <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-zinc-900/80 border border-slate-100 dark:border-zinc-700/50 rounded-2xl">
                    <div className="w-9 h-9 shrink-0 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl flex items-center justify-center shadow-sm">
                      <Calendar className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-zinc-500 font-medium mb-0.5">Fecha</div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {selectedDate ? new Date(selectedDate).toLocaleDateString('es-MX') : 'Selecciona una fecha'}
                      </div>
                    </div>
                  </div>

                  {/* Hora */}
                  <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-zinc-900/80 border border-slate-100 dark:border-zinc-700/50 rounded-2xl">
                    <div className="w-9 h-9 shrink-0 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl flex items-center justify-center shadow-sm">
                      <Clock className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-zinc-500 font-medium mb-0.5">Hora</div>
                      <div className="font-bold text-slate-900 dark:text-white">{selectedTime || 'Selecciona un horario'}</div>
                    </div>
                  </div>
                </div>

              {(!vehiclesInfo || !selectedDate || !selectedTime) && (
                  <p className="mt-4 text-xs text-slate-500 dark:text-zinc-500 text-center">
                    Completa todos los pasos para confirmar
                  </p>
                )}

                <Button
                  disabled={!vehiclesInfo || !selectedDate || !selectedTime}
                  onClick={handleConfirmAppointment}
                  size="lg"
                  className="w-full mt-5"
                >
                  <Check className="w-5 h-5" />
                  Confirmar Cita
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BookingPage;
