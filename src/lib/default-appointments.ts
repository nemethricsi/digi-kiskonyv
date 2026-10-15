export const DEFAULT_APPOINTMENT_COUNT = 3;
export const DEFAULT_APPOINTMENT_TITLE = 'Munkaügyi tájékoztató';

const FIRST_AFTER_DAYS = 7;
const HOUR_UTC = 8;

export function defaultAppointmentDates(startDate: Date): Date[] {
  return Array.from({ length: DEFAULT_APPOINTMENT_COUNT }, (_, index) => {
    const date = new Date(startDate);
    date.setUTCDate(date.getUTCDate() + FIRST_AFTER_DAYS);
    date.setUTCMonth(date.getUTCMonth() + index);
    date.setUTCHours(HOUR_UTC, 0, 0, 0);
    return date;
  });
}
