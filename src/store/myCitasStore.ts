import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

// Helper to get the current authenticated user's ID
const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
};

export interface Cita {
  id: string;
  folio: string;
  vehicle: string;
  vehicleType: string;
  center: string;
  address: string;
  date: string;
  time: string;
  status: 'confirmada' | 'pendiente' | 'completada' | 'cancelada';
  createdAt: string;
  vehicleModel?: string;
  hologram?: string;
  hologramLabel?: string;
  verificationStatus?: 'aprobada' | 'rechazada' | 'en_proceso' | 'sin_verificar';
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
  isLoading: boolean;
  pollingId: ReturnType<typeof setInterval> | null;
  fetchCitas: () => Promise<void>;
  addCita: (cita: Omit<Cita, 'id' | 'createdAt' | 'folio' | 'vehicleModel' | 'hologram' | 'hologramLabel'> & { folio?: string; vehicleModel?: string; hologram?: string; hologramLabel?: string }) => Promise<void>;
  removeCita: (id: string) => Promise<void>;
  updateStatus: (id: string, status: Cita['status']) => Promise<void>;
  updateVerificationStatus: (id: string, verificationStatus: NonNullable<Cita['verificationStatus']>) => Promise<void>;
  startPolling: (intervalMs?: number) => void;
  stopPolling: () => void;
}

export const useMyCitasStore = create<MyCitasState>()(
  persist(
    (set, get) => ({
      citas: [],
      isLoading: false,
      pollingId: null,

      fetchCitas: async () => {
        set({ isLoading: true });
        const userId = await getCurrentUserId();

        let query = supabase
          .from('appointments')
          .select('*')
          .order('created_at', { ascending: false });

        // Filter by user if authenticated (graceful: works even without user_id column yet)
        if (userId) {
          query = query.eq('user_id', userId);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching appointments:', error);
          set({ isLoading: false });
          return;
        }

        const formattedData: Cita[] = (data || []).map(item => ({
          id: item.id,
          folio: item.folio,
          vehicle: item.vehicle,
          vehicleType: item.vehicle_type,
          center: item.center,
          address: item.address,
          date: item.date,
          time: item.time,
          status: item.status as Cita['status'],
          createdAt: item.created_at,
          vehicleModel: item.vehicle_model,
          hologram: item.hologram,
          hologramLabel: item.hologram_label,
          verificationStatus: item.verification_status || (item.status === 'completada' ? 'aprobada' : 'sin_verificar'),
        }));

        set({ citas: formattedData, isLoading: false });
      },

      addCita: async (cita) => {
        const userId = await getCurrentUserId();
        const newCita: Record<string, any> = {
          folio: cita.folio || generateFolio(),
          vehicle: cita.vehicle,
          vehicle_type: cita.vehicleType,
          center: cita.center,
          address: cita.address,
          date: cita.date,
          time: cita.time,
          status: 'confirmada',
          vehicle_model: cita.vehicleModel,
          hologram: cita.hologram,
          hologram_label: cita.hologramLabel,
        };

        // Attach user_id if logged in
        if (userId) {
          newCita.user_id = userId;
        }

        let { data, error } = await supabase
          .from('appointments')
          .insert([newCita])
          .select();

        // Fallback for missing newly added columns 'vehicle_model', 'hologram', 'hologram_label'
        if (error && error.code === 'PGRST204') {
          console.warn("La columna vehicle_model u hologram no existe en la BD. Guardando sin ella...");
          const { vehicle_model, hologram, hologram_label, ...fallbackCita } = newCita;
          const fallbackResult = await supabase
            .from('appointments')
            .insert([fallbackCita])
            .select();
          data = fallbackResult.data;
          error = fallbackResult.error;
        }

        if (error) {
          console.error('Error adding appointment:', error);
          // Fallback local if DB fails? Better to error out or alert.
          return;
        }

        if (data && data[0]) {
          const item = data[0];
          const formatted: Cita = {
            id: item.id,
            folio: item.folio,
            vehicle: item.vehicle,
            vehicleType: item.vehicle_type,
            center: item.center,
            address: item.address,
            date: item.date,
            time: item.time,
            status: item.status as Cita['status'],
            createdAt: item.created_at,
            vehicleModel: item.vehicle_model,
            hologram: item.hologram,
            hologramLabel: item.hologram_label,
            verificationStatus: 'sin_verificar',
          };
          set((state) => ({ citas: [formatted, ...state.citas] }));
        }
      },

      removeCita: async (id) => {
        const { error } = await supabase
          .from('appointments')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error removing appointment:', error);
          return;
        }

        set((state) => ({
          citas: state.citas.filter((c) => c.id !== id)
        }));
      },

      updateStatus: async (id, status) => {
        const { error } = await supabase
          .from('appointments')
          .update({ status })
          .eq('id', id);

        if (error) {
          console.error('Error updating status:', error);
          return;
        }

        set((state) => ({
          citas: state.citas.map((c) => c.id === id ? { ...c, status } : c)
        }));
      },

      updateVerificationStatus: async (id, verificationStatus) => {
        // Try updating in Supabase first
        const { error } = await supabase
          .from('appointments')
          .update({ verification_status: verificationStatus })
          .eq('id', id);

        if (error) {
          console.warn('Could not update verification_status in DB (column may not exist yet). Updating locally.', error);
        }

        // Always update locally so the UI reflects the change
        set((state) => ({
          citas: state.citas.map((c) => c.id === id ? { ...c, verificationStatus } : c)
        }));
      },

      startPolling: (intervalMs = 30000) => {
        const { pollingId, fetchCitas } = get();
        // Don't start if already polling
        if (pollingId) return;
        console.log(`[Polling] Sincronización automática cada ${intervalMs / 1000}s`);
        const id = setInterval(() => {
          fetchCitas();
        }, intervalMs);
        set({ pollingId: id });
      },

      stopPolling: () => {
        const { pollingId } = get();
        if (pollingId) {
          clearInterval(pollingId);
          set({ pollingId: null });
          console.log('[Polling] Sincronización detenida');
        }
      },
    }),
    {
      name: 'my-citas-storage',
      // Only persist the citas list
      partialize: (state) => ({
        citas: state.citas,
      }),
    }
  )
);