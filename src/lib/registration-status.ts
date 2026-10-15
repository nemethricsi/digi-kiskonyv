import type { BadgeType } from 'dap-design-system';

export const REGISTRATION_STATUSES = [
  'requested',
  'approved',
  'rejected',
  'closed',
] as const;
export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number];

/** A citizen can have only one of these at a time */
export const ACTIVE_REGISTRATION_STATUSES = [
  'requested',
  'approved',
] as const satisfies RegistrationStatus[];

export const REGISTRATION_STATUS_LABELS: Record<RegistrationStatus, string> = {
  requested: 'Elbírálás alatt',
  approved: 'Aktív',
  rejected: 'Elutasítva',
  closed: 'Lezárva',
};

export const REGISTRATION_STATUS_BADGES: Record<RegistrationStatus, BadgeType> =
  {
    requested: 'warning',
    approved: 'positive',
    rejected: 'negative',
    closed: 'neutral',
  };
