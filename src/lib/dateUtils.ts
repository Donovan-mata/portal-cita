import { Cita } from '@/store/myCitasStore';

export function parseCitaDate(dateStr: string, timeStr: string): Date | null {
  try {
    const months: Record<string, number> = {
      enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
      julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11,
    };
    const dp = dateStr.toLowerCase().match(/(\d+)\s+de\s+(\w+)\s+de\s+(\d{4})/);
    if (!dp) return null;
    const day = parseInt(dp[1]);
    const month = months[dp[2]];
    const year = parseInt(dp[3]);

    const tp = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!tp) return null;
    let hours = parseInt(tp[1]);
    const minutes = parseInt(tp[2]);
    const period = tp[3].toUpperCase();
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return new Date(year, month, day, hours, minutes, 0);
  } catch {
    return null;
  }
}

export function buildGoogleCalendarUrl(cita: Cita): string {
  const target = parseCitaDate(cita.date, cita.time);
  if (!target) return 'https://calendar.google.com';

  const pad = (n: number) => String(n).padStart(2, '0');
  const fmt = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

  const end = new Date(target.getTime() + 60 * 60 * 1000);
  const title    = encodeURIComponent(`Verificación Vehicular – ${cita.vehicle}`);
  const location = encodeURIComponent(`${cita.center}, ${cita.address}`);
  const details  = encodeURIComponent(
    `Cita de verificación vehicular.\nVehículo: ${cita.vehicle} (${cita.vehicleType})\nCentro: ${cita.center}\nDirección: ${cita.address}`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(target)}/${fmt(end)}&details=${details}&location=${location}`;
}
