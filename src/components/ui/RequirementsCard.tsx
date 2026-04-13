import React from 'react';
import { Check, X, AlertTriangle } from 'lucide-react';

interface Requirement {
  label: string;
  status: 'check' | 'cross' | 'warning';
}

interface RequirementsCardProps {
  title: string;
  requirements: Requirement[];
  className?: string;
}

export const RequirementsCard: React.FC<RequirementsCardProps> = ({ 
  title, 
  requirements,
  className = '' 
}) => {
  return (
    <div className={`bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden ${className}`}>
      <div className="bg-amber-50 border-b border-amber-100 px-6 py-4 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600" />
        <h3 className="font-bold text-amber-900">{title}</h3>
      </div>
      <div className="p-6">
        <ul className="space-y-3">
          {requirements.map((req, index) => (
            <li key={index} className="flex items-center gap-3">
              {req.status === 'check' && (
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
              )}
              {req.status === 'cross' && (
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <X className="w-3 h-3 text-red-600" />
                </div>
              )}
              {req.status === 'warning' && (
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                </div>
              )}
              <span className={`text-sm ${
                req.status === 'cross' ? 'text-red-600 font-medium' : 'text-slate-700'
              }`}>
                {req.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
