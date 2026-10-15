export const APPOINTMENT_STATUSES = [
  'scheduled',
  'attended',
  'missed',
  'cancelled',
] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  scheduled: 'Ütemezve',
  attended: 'Megjelent',
  missed: 'Nem jelent meg',
  cancelled: 'Lemondva',
};
