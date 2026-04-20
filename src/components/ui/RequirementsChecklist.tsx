import React, { useState } from 'react';
import { Check, AlertTriangle, Calendar, FileText, Car, CreditCard, User, AlertCircle } from 'lucide-react';

interface RequirementsChecklistProps {
  requirements: string[];
  onComplete: () => void;
  className?: string;
}

const icons = [FileText, CreditCard, Car, User, AlertCircle, FileText, CreditCard];

const getIcon = (index: number) => icons[index % icons.length];

export const RequirementsChecklist: React.FC<RequirementsChecklistProps> = ({ 
  requirements,
  onComplete,
  className = '' 
}) => {
  const [checked, setChecked] = useState<boolean[]>(
    new Array(requirements.length).fill(false)
  );

  const handleToggle = (index: number) => {
    const newChecked = [...checked];
    newChecked[index] = !newChecked[index];
    setChecked(newChecked);
  };

  const allChecked = checked.every(Boolean);

  return (
    <div className={`bg-white dark:bg-zinc-900 rounded-2xl border-2 border-amber-300 shadow-xl overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-white" />
          <h3 className="font-bold text-white text-lg">Antes de agendar tu cita</h3>
        </div>
      </div>
      
      <div className="p-5">
        <ul className="space-y-2 mb-5">
          {requirements.map((label, index) => {
            const Icon = getIcon(index);
            return (
              <li key={index}>
                <button 
                  onClick={() => handleToggle(index)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 text-left group ${
                    checked[index] 
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/30' 
                      : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-amber-400 hover:bg-amber-50 dark:hover:border-amber-500 dark:hover:bg-amber-950/20'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                    checked[index] 
                      ? 'bg-green-500 text-white' 
                      : 'bg-slate-100 dark:bg-zinc-700 text-slate-500 dark:text-zinc-400 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 group-hover:text-amber-600'
                  }`}>
                    {checked[index] ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-sm font-medium flex-1 ${
                    checked[index] ? 'text-green-800 dark:text-green-300' : 'text-slate-700 dark:text-zinc-200'
                  }`}>
                    {label}
                  </span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    checked[index] 
                      ? 'border-green-500 bg-green-500' 
                      : 'border-slate-300 dark:border-zinc-600'
                  }`}>
                    {checked[index] && <Check className="w-3 h-3 text-white" />}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-2 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${(checked.filter(Boolean).length / requirements.length) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-zinc-400 whitespace-nowrap">
            {checked.filter(Boolean).length}/{requirements.length}
          </span>
        </div>
        
        <button
          onClick={onComplete}
          disabled={!allChecked}
          className={`w-full py-3 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 ${
            allChecked
              ? 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg'
              : 'bg-slate-200 dark:bg-zinc-700 text-slate-400 dark:text-zinc-500 cursor-not-allowed'
          }`}
        >
          <Calendar className="w-5 h-5" />
          {allChecked ? 'Agendar mi cita' : 'Marca todos los requisitos'}
        </button>
      </div>
    </div>
  );
};
