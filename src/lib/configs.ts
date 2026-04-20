import React from 'react';
import { CheckCircle, Hourglass, XCircle, AlertTriangle, Clock } from 'lucide-react';

export type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

export interface StatusConfigEntry {
  variant: StatusVariant;
  label: string;
  icon: React.ElementType;
}

export const statusConfig: Record<string, StatusConfigEntry> = {
  confirmada: { variant: 'success', label: 'Confirmada', icon: CheckCircle },
  pendiente:  { variant: 'warning', label: 'Pendiente',  icon: Hourglass },
  completada: { variant: 'info',    label: 'Completada', icon: CheckCircle },
  cancelada:  { variant: 'error',   label: 'Cancelada',  icon: XCircle },
};

export const verificationStatusConfig: Record<string, StatusConfigEntry> = {
  aprobada: { variant: 'success', label: 'Verificación Aprobada', icon: CheckCircle },
  rechazada: { variant: 'error', label: 'Verificación Rechazada', icon: XCircle },
  en_proceso: { variant: 'info', label: 'En Proceso', icon: AlertTriangle },
  sin_verificar: { variant: 'default', label: 'Sin Verificar', icon: Clock },
};
