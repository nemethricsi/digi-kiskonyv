import { hasAccess } from '@/access';
import {
  REGISTRATION_STATUS_LABELS,
  REGISTRATION_STATUSES,
} from '@/lib/registration-status';

import type { RegistrationStatus } from '@/lib/registration-status';
import type { CollectionConfig } from 'payload';

// The job seeker request AND the job seeking period in one record (see docs/project-summary.md)
export const Registrations: CollectionConfig = {
  slug: 'registrations',
  labels: {
    plural: 'Nyilvántartásba vételek',
    singular: 'Nyilvántartásba vétel',
  },
  admin: {
    defaultColumns: ['citizen', 'status', 'requestedAt', 'startDate'],
  },
  access: {
    read: hasAccess('admin', 'clerk'),
    create: hasAccess('admin', 'clerk'),
    update: hasAccess('admin', 'clerk'),
    delete: hasAccess('admin'),
  },
  fields: [
    {
      name: 'citizen',
      label: 'Állampolgár',
      type: 'relationship',
      relationTo: 'citizens',
      required: true,
      index: true,
    },
    {
      name: 'status',
      label: 'Státusz',
      type: 'select',
      options: REGISTRATION_STATUSES.map((status) => ({
        value: status,
        label: REGISTRATION_STATUS_LABELS[status],
      })),
      defaultValue: 'requested' satisfies RegistrationStatus,
      required: true,
      index: true,
    },
    {
      name: 'requestedAt',
      label: 'Kérelem ideje',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      required: true,
      admin: {
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'startDate',
      label: 'Álláskeresés kezdete',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' },
      },
    },
    {
      name: 'endDate',
      label: 'Álláskeresés vége',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' },
      },
    },
  ],
};
