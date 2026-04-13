import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Cita {
  id: string;
  folio: string; // New field for official folio
  vehicle: string;
  vehicleType: string;
  center: string;
  address: string;
  date: string;
  time: string;
  status: 'confirmada' | 'pendiente' | 'completada' | 'cancelada';
  createdAt: string;
}

export const generateFolio = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `V-${result}`;
};

interface MyCitasState {
  citas: Cita[];
  addCita: (cita: Omit<Cita, 'id' | 'createdAt' | 'folio'> & { folio?: string }) => void;
  removeCita: (id: string) => void;
  updateStatus: (id: string, status: Cita['status']) => void;
}

export const useMyCitasStore = create<MyCitasState>()(
  persist(
    (set) => ({
      citas: [],
      addCita: (cita) => set((state) => ({
        citas: [...state.citas, {
          ...cita,
          id: crypto.randomUUID(),
          folio: cita.folio || generateFolio(),
          createdAt: new Date().toISOString(),
        }]
      })),
      removeCita: (id) => set((state) => ({
        citas: state.citas.filter((c) => c.id !== id)
      })),
      updateStatus: (id, status) => set((state) => ({
        citas: state.citas.map((c) => c.id === id ? { ...c, status } : c)
      })),
    }),
    {
      name: 'my-citas-storage',
    }
  )
);