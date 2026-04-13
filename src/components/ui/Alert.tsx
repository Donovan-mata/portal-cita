import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

type AlertVariant = 'success' | 'warning' | 'error' | 'info';

interface AlertProps {
  title: string;
  description?: string;
  variant?: AlertVariant;
  className?: string;
}

const variantConfig: Record<AlertVariant, { bg: string; border: string; icon: React.ReactNode; iconBg: string }> = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    iconBg: 'bg-green-100',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    iconBg: 'bg-amber-100',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: <XCircle className="w-5 h-5 text-red-600" />,
    iconBg: 'bg-red-100',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: <Info className="w-5 h-5 text-blue-600" />,
    iconBg: 'bg-blue-100',
  },
};

export const Alert: React.FC<AlertProps> = ({ title, description, variant = 'info', className = '' }) => {
  const config = variantConfig[variant];

  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${config.bg} ${config.border} ${className}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${config.iconBg}`}>
        {config.icon}
      </div>
      <div>
        <p className="font-medium text-slate-900 dark:text-white">{title}</p>
        {description && <p className="text-sm text-slate-600 mt-1">{description}</p>}
      </div>
    </div>
  );
};
