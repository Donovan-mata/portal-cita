export interface VerificationCenter {
  id: string;
  name: string;
  address: string;
  zone: string;
  phone?: string;
}

export const verificationCenters: VerificationCenter[] = [
  { id: '1', name: 'Verificentro AZ 20 Vallejo', address: 'Av. Vallejo 123', zone: 'Norte', phone: '55 1234 5678' },
  { id: '2', name: 'Verificentro Centro', address: 'Centro Histórico, CDMX', zone: 'Centro', phone: '55 2345 6789' },
  { id: '3', name: 'Verificentro Sur', address: 'Av. del Imán, CDMX', zone: 'Sur', phone: '55 3456 7890' },
  { id: '4', name: 'Verificentro Norte', address: 'Av. Instituto Politécnico, CDMX', zone: 'Norte', phone: '55 4567 8901' },
  { id: '5', name: 'Verificentro Oriente', address: 'Av. Zaragoza, CDMX', zone: 'Oriente', phone: '55 5678 9012' },
];

export const availableTimes = [
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
];