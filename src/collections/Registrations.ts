import { hasAccess } from '@/access';
import {
  DEFAULT_APPOINTMENT_TITLE,
  defaultAppointmentDates,
} from '@/lib/default-appointments';
import {
  REGISTRATION_STATUS_LABELS,
  REGISTRATION_STATUSES,
} from '@/lib/registration-status';

import type { RegistrationStatus } from '@/lib/registration-status';
import type { Registration } from '@/payload-types';
import type { CollectionAfterChangeHook, CollectionConfig } from 'payload';

const createDefaultAppointments: CollectionAfterChangeHook<
  Registration
> = async ({ doc, previousDoc, req }) => {
  const approved: RegistrationStatus = 'approved';
  if (doc.status !== approved || previousDoc?.status === approved) {
    return doc;
  }

  const startDate = doc.startDate ? new Date(doc.startDate) : new Date();
  for (const scheduledAt of defaultAppointmentDates(startDate)) {
    await req.payload.create({
      collection: 'appointments',
      data: {
        registration: doc.id,
        title: DEFAULT_APPOINTMENT_TITLE,
        scheduledAt: scheduledAt.toISOString(),
        status: 'scheduled',
      },
      req, // same transaction: if one fails, the approval is rolled back too
    });
  }

  return doc;
};

export const Registrations: CollectionConfig = {
  slug: 'registrations',
  labels: {
    plural: 'Nyilvántartásba vételek',
    singular: 'Nyilvántartásba vétel',
  },
  admin: {
    defaultColumns: ['citizen', 'status', 'requestedAt', 'startDate'],
    useAsTitle: 'requestedAt',
  },
  access: {
    read: hasAccess('admin', 'clerk'),
    create: hasAccess('admin', 'clerk'),
    update: hasAccess('admin', 'clerk'),
    delete: hasAccess('admin'),
  },
  hooks: {
    afterChange: [createDefaultAppointments],
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
    {
      name: 'appointments',
      label: 'Időpontok',
      type: 'join',
      collection: 'appointments',
      on: 'registration',
      defaultSort: 'scheduledAt',
      admin: {
        defaultColumns: ['scheduledAt', 'title', 'status'],
      },
    },
  ],
};
