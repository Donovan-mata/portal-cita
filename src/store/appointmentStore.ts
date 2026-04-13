import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VerificationCenter {
  id: string;
  name: string;
  address: string;
  zone: string;
}

interface VehicleData {
  plate: string;
  type: string;
  model: string;
}

interface AppointmentState {
  selectedCenter: VerificationCenter | null;
  selectedDate: string | null;
  selectedTime: string | null;
  vehiclesInfo: VehicleData[] | null;
  setSelectedCenter: (center: VerificationCenter | null) => void;
  setSelectedDate: (date: string | null) => void;
  setSelectedTime: (time: string | null) => void;
  setVehiclesInfo: (info: VehicleData[] | null) => void;
  reset: () => void;
}

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set) => ({
      selectedCenter: null,
      selectedDate: null,
      selectedTime: null,
      vehiclesInfo: null,
      setSelectedCenter: (center) => set({ selectedCenter: center }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedTime: (time) => set({ selectedTime: time }),
      setVehiclesInfo: (info) => set({ vehiclesInfo: info }),
      reset: () => set({
        selectedCenter: null,
        selectedDate: null,
        selectedTime: null,
        vehiclesInfo: null,
      }),
    }),
    {
      name: 'appointment-storage',
    }
  )
);