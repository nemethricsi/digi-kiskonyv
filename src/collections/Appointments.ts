import { ValidationError } from 'payload';

import { hasAccess } from '@/access';
import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUSES,
} from '@/lib/appointment-status';
import { relationId } from '@/lib/relation-id';

import type { AppointmentStatus } from '@/lib/appointment-status';
import type { RegistrationStatus } from '@/lib/registration-status';
import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload';

/** Set in `req.context` by the attendance hook: only a stamp may mark an appointment attended */
export const FROM_ATTENDANCE = 'fromAttendance';

const protectAttendedStatus: CollectionBeforeChangeHook = ({
  context,
  data,
  originalDoc,
}) => {
  const attended: AppointmentStatus = 'attended';
  const statusChanged =
    data.status !== undefined && data.status !== originalDoc?.status;

  if (statusChanged && data.status === attended && !context[FROM_ATTENDANCE]) {
    throw new ValidationError({
      collection: 'appointments',
      errors: [
        {
          path: 'status',
          message: 'Megjelentre csak a megjelenés rögzítése állíthatja.',
        },
      ],
    });
  }
  if (statusChanged && originalDoc?.status === attended) {
    throw new ValidationError({
      collection: 'appointments',
      errors: [
        {
          path: 'status',
          message: 'Rögzített megjelenés státusza nem módosítható.',
        },
      ],
    });
  }

  return data;
};

// Only for an approved registration, not before its startDate.
// The citizen is copied from the registration (denormalized for simple access control).
const validateAndFill: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  operation,
  req,
}) => {
  const registrationId = relationId(
    data.registration ?? originalDoc?.registration,
  );
  const registrationChanged =
    operation === 'create' ||
    registrationId !== relationId(originalDoc?.registration);
  const scheduledAtChanged =
    operation === 'create' ||
    (data.scheduledAt !== undefined &&
      data.scheduledAt !== originalDoc?.scheduledAt);

  if (operation === 'create' && req.user?.collection === 'users') {
    data.createdBy = req.user.id;
  }

  if (!registrationId || (!registrationChanged && !scheduledAtChanged)) {
    return data;
  }

  const registration = await req.payload.findByID({
    collection: 'registrations',
    id: registrationId,
    depth: 0,
    req, // same transaction
  });

  if (
    registrationChanged &&
    registration.status !== ('approved' satisfies RegistrationStatus)
  ) {
    throw new ValidationError({
      collection: 'appointments',
      errors: [
        {
          path: 'registration',
          message: 'Időpont csak jóváhagyott (aktív) kérelemhez vehető fel.',
        },
      ],
    });
  }

  const scheduledAt = data.scheduledAt ?? originalDoc?.scheduledAt;
  if (
    registration.startDate &&
    scheduledAt &&
    new Date(scheduledAt) < new Date(registration.startDate)
  ) {
    throw new ValidationError({
      collection: 'appointments',
      errors: [
        {
          path: 'scheduledAt',
          message: 'Az időpont nem lehet az álláskeresés kezdete előtt.',
        },
      ],
    });
  }

  data.citizen = relationId(registration.citizen);
  return data;
};

export const Appointments: CollectionConfig = {
  slug: 'appointments',
  labels: {
    plural: 'Előírt jelentkezések',
    singular: 'Előírt jelentkezés',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['scheduledAt', 'title', 'citizen', 'status'],
  },
  access: {
    read: hasAccess('admin', 'clerk'),
    create: hasAccess('admin', 'clerk'),
    update: hasAccess('admin', 'clerk'),
    delete: hasAccess('admin'),
  },
  hooks: {
    beforeChange: [protectAttendedStatus, validateAndFill],
  },
  fields: [
    {
      name: 'registration',
      label: 'Nyilvántartásba vétel',
      type: 'relationship',
      relationTo: 'registrations',
      required: true,
      index: true,
    },
    {
      name: 'citizen',
      label: 'Állampolgár',
      type: 'relationship',
      relationTo: 'citizens',
      index: true,
      admin: {
        readOnly: true,
        description: 'A nyilvántartásba vételből töltődik ki.',
      },
    },
    {
      name: 'title',
      label: 'Megnevezés',
      type: 'text',
      required: true,
    },
    {
      name: 'scheduledAt',
      label: 'Időpont',
      type: 'date',
      required: true,
      index: true,
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'status',
      label: 'Státusz',
      type: 'select',
      options: APPOINTMENT_STATUSES.map((status) => ({
        value: status,
        label: APPOINTMENT_STATUS_LABELS[status],
      })),
      defaultValue: 'scheduled' satisfies AppointmentStatus,
      required: true,
      index: true,
    },
    {
      name: 'createdBy',
      label: 'Rögzítette',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
      },
    },
  ],
};
