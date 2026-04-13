import React from 'react';
import { FileCheck, Map, Clock, CheckCircle } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ProcessSteps: React.FC = () => {
  const steps: Step[] = [
    {
      id: 1,
      title: "Revisar Requisitos",
      description: "Asegúrate de no tener multas o adeudos de tenencia vigentes antes de iniciar.",
      icon: <FileCheck className="w-8 h-8 text-white" />
    },
    {
      id: 2,
      title: "Ubica tu Verificentro",
      description: "Contamos con más de 70 centros autorizados. Selecciona el más cercano a ti.",
      icon: <Map className="w-8 h-8 text-white" />
    },
    {
      id: 3,
      title: "Elegir Fecha y Hora",
      description: "Selecciona el horario que mejor se adapte a tu agenda en tiempo real.",
      icon: <Clock className="w-8 h-8 text-white" />
    },
    {
      id: 4,
      title: "Confirmación",
      description: "Recibe tu folio y comprobante de cita directamente en tu correo electrónico.",
      icon: <CheckCircle className="w-8 h-8 text-white" />
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-zinc-900 relative" id="requisitos">
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            ¿Cómo funciona el proceso?
          </h2>
          <p className="text-lg text-slate-500">
            Hemos simplificado el sistema para que agendar tu cita sea rápido, transparente y sin complicaciones en cuatro sencillos pasos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className="group relative bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-slate-100 dark:border-zinc-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(212,17,17,0.1)] hover:-translate-y-2 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${0.1 * step.id}s` }}
            >
              <div className="absolute top-6 right-6 text-6xl font-black text-slate-50 group-hover:text-red-50 transition-colors duration-300 select-none">
                0{step.id}
              </div>
              
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mb-8 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-red-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
