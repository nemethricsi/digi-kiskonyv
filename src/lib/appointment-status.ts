import type {
  BadgeType,
  ListItemStatus,
  ListItemVariant,
} from 'dap-design-system';

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

export const APPOINTMENT_STATUS_BADGES: Record<AppointmentStatus, BadgeType> = {
  scheduled: 'info',
  attended: 'positive',
  missed: 'negative',
  cancelled: 'neutral',
};

export const APPOINTMENT_STATUS_LIST_ITEMS: Record<
  AppointmentStatus,
  { variant: ListItemVariant; status: ListItemStatus }
> = {
  scheduled: { variant: 'empty', status: 'brand' },
  attended: { variant: 'pass', status: 'positive' },
  missed: { variant: 'fail', status: 'negative' },
  cancelled: { variant: 'notapplicable', status: 'neutral' },
};
